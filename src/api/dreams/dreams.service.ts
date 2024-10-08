import { ObjectId } from "mongoose";
import dreamsRepository from "./dreams.repository";
import usersService from "../users/users.service";
import { boolean, number, object, string } from "yup";
import { DreamRequest } from "../../shared/models/request/dream-request";
import { MediaSchema } from "../../shared/schema/media";
import { S3Service } from "../../shared/services/s3.service";

const dreamSchema = object({
  title: string().trim().required(),
  dream: string().trim().required(),
  recurrent: boolean().required(),
  nightmare: boolean().required(),
  paralysis: boolean().required(),
  favorite: boolean().required(),
  createdAt: string().trim().required(),
});

const fileSchema = object({
  fileType: string().trim().required(),
  fileUrl: string().trim().required(),
  filename: string().trim().required(),
  size: number().positive().integer().required(),
});

const getDreams = async (page: number, pageSize: number) => {
  const { totalItems, totalPages, dreams } = await dreamsRepository.getDreams(page, pageSize);
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  let newDreams = [];
  for (let dream of dreams) {
    const user = await usersService.getUser(String(dream.userId));

    let image = null;
    let audio = null;
    if (dream.imageId) {
      image = await dreamsRepository.getDreamMediaById(String(dream.imageId));
    }
    if (dream.audioId) {
      audio = await dreamsRepository.getDreamMediaById(String(dream.audioId));
    }

    newDreams.push({
      ...dream,
      user: user?.toModel,
      image: image && image.toDreamModel,
      audio: audio && audio.toDreamModel,
    });
  }

  return { totalItems, totalPages, page, pageSize, isFirstPage, isLastPage, items: newDreams };
};

const addDream = async (id: ObjectId, reqBody: DreamRequest) => {
  const validateInputs = await dreamSchema.validate({
    title: reqBody.title,
    dream: reqBody.dream,
    recurrent: reqBody.recurrent,
    nightmare: reqBody.nightmare,
    paralysis: reqBody.paralysis,
    favorite: reqBody.favorite,
    createdAt: reqBody.createdAt,
  });

  const { image, audio } = await saveFile(reqBody);
  const dream = { ...validateInputs, imageId: image?.id || null, audioId: audio?.id || null };

  const addedDream = await dreamsRepository.addDream(id, dream);
  const forReturn = { ...addedDream.toJSON(), image, audio };

  return forReturn;
};

const updateDream = async (reqBody: DreamRequest) => {
  const validateInputs = await dreamSchema.validate({
    id: reqBody.id,
    title: reqBody.title,
    dream: reqBody.dream,
    recurrent: reqBody.recurrent,
    nightmare: reqBody.nightmare,
    paralysis: reqBody.paralysis,
    favorite: reqBody.favorite,
    createdAt: reqBody.createdAt,
  });

  const { image, audio } = await saveFile(reqBody);
  const dream = { ...validateInputs, imageId: image?.id || null, audioId: audio?.id || null };

  const updatedDream = await dreamsRepository.updateDream(dream);
  const forReturn = { ...updatedDream?.toJSON(), image, audio };

  return forReturn;
};

const deleteDream = async (id: string, username: string, signal: AbortSignal) => {
  const user = await usersService.getUserByUsername(username);
  const dream = await dreamsRepository.getDreamById(id);
  const s3 = new S3Service(user?.id);
  // Prepare batch deletion tasks
  const deletionTasks: Promise<any>[] = [];

  // Delaying for 2 seconds before proceeding incase user want's to cancel the request.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (signal.aborted) {
    throw new Error("Delete action cancelled");
  }

  if (dream?.imageId) {
    const image = await dreamsRepository.getDreamMediaById(String(dream.imageId));
    if (image) {
      deletionTasks.push(s3.delete(image.filename));
      deletionTasks.push(dreamsRepository.deleteMedia(String(dream.imageId)));
    }
  }

  if (dream?.audioId) {
    const audio = await dreamsRepository.getDreamMediaById(String(dream.audioId));
    if (audio) {
      deletionTasks.push(s3.delete(audio.filename));
      deletionTasks.push(dreamsRepository.deleteMedia(String(dream.audioId)));
    }
  }
  deletionTasks.push(dreamsRepository.deleteDream(id));
  // Perform all deletion tasks in parallel
  return await Promise.all(deletionTasks);
};

const saveFile = async (reqBody: DreamRequest) => {
  let image = null;
  let audio = null;
  if (reqBody.image) {
    const validateFile = await fileSchema.validate({
      fileType: reqBody.image.fileType,
      fileUrl: reqBody.image.fileUrl,
      filename: reqBody.image.filename,
      size: reqBody.image.size,
    });
    const media = await new MediaSchema({ ...validateFile }).save();

    const type = validateFile.fileType.split("/")[0];

    switch (type) {
      case "image":
        image = media;
        break;
      case "audio":
        audio = media;
        break;
      default:
        break;
    }
  }
  return { image, audio };
};

export const getRecentDreams = async () => {
  const favorite = await dreamsRepository.getRecenDreams("favorite");
  const nightmare = await dreamsRepository.getRecenDreams("nightmare");
  const paralysis = await dreamsRepository.getRecenDreams("paralysis");
  const recurrent = await dreamsRepository.getRecenDreams("recurrent");
  return {
    favorite,
    nightmare,
    paralysis,
    recurrent,
  };
};

export const getRecentlyFavorites = async () => {
  return await dreamsRepository.getRecenDreams("favorite");
};

export const getRecentlyNightmares = async () => {
  return await dreamsRepository.getRecenDreams("nightmare");
};

export const getRecentlyParalysis = async () => {
  return await dreamsRepository.getRecenDreams("paralysis");
};

export const getRecentlyRecurrent = async () => {
  return await dreamsRepository.getRecenDreams("recurrent");
};

export default {
  getDreams,
  addDream,
  updateDream,
  deleteDream,
  getRecentDreams,
  getRecentlyFavorites,
  getRecentlyNightmares,
  getRecentlyParalysis,
  getRecentlyRecurrent,
};
