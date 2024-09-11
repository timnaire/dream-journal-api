import { ObjectId } from "mongoose";
import { Dream } from "../../shared/models/dream";
import dreamsRepository from "./dreams.repository";
import usersService from "../users/users.service";
import { boolean, number, object, string } from "yup";
import { DreamRequest } from "../../shared/models/request/dream-request";
import { MediaSchema } from "../../shared/schema/media";

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

const getDreams = async () => {
  const dreams = await dreamsRepository.getDreams();

  let newDreams = [];
  for (let dream of dreams) {
    const user = await usersService.getUser(String(dream.userId));

    let image = null;
    let audio = null;
    if (dream.imageId) {
      image = await dreamsRepository.getDreamMedia(String(dream.imageId));
    }
    if (dream.audioId) {
      audio = await dreamsRepository.getDreamMedia(String(dream.audioId));
    }

    newDreams.push({
      ...dream.toJSON(),
      user: user?.toModel,
      image: image && image.toDreamModel,
      audio: audio && audio.toDreamModel,
    });
  }

  return newDreams;
};

const addDream = async (id: ObjectId, reqBody: DreamRequest) => {
  const validateDream = await dreamSchema.validate({
    title: reqBody.title,
    dream: reqBody.dream,
    recurrent: reqBody.recurrent,
    nightmare: reqBody.nightmare,
    paralysis: reqBody.paralysis,
    favorite: reqBody.favorite,
    createdAt: reqBody.createdAt,
  });

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

  const dream = { ...validateDream, imageId: image?.id || null, audioId: audio?.id || null };

  return dreamsRepository.addDream(id, dream);
};

const updateDream = async (reqBody: DreamRequest) => {
  const validateDream = await dreamSchema.validate({
    id: reqBody.id,
    title: reqBody.id,
    dream: reqBody.id,
    recurrent: reqBody.id,
    nightmare: reqBody.id,
    paralysis: reqBody.id,
    favorite: reqBody.id,
    createdAt: reqBody.id,
  });

  const { image, audio } = await saveFile(reqBody);

  const dream = { ...validateDream, imageId: image?.id || null, audioId: audio?.id || null };
  console.log('dream', dream);
  return dreamsRepository.updateDream(dream);
};

const deleteDream = (id: string) => {
  return dreamsRepository.deleteDream(id);
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

export default { getDreams, addDream, updateDream, deleteDream };
