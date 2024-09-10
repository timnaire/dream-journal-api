import { ObjectId } from "mongoose";
import { Dream } from "../../shared/models/dream";
import dreamsRepository from "./dreams.repository";
import usersService from "../users/users.service";
import { boolean, number, object, string } from "yup";
import { DreamRequest } from "../../shared/models/request/dream-request";
import { MediaSchema } from "../../shared/schema/media";

const getDreams = async () => {
  const dreams = await dreamsRepository.getDreams();

  let newDreams = [];
  for (let dream of dreams) {
    const user = await usersService.getUser(String(dream.userId));

    let image,
      audio = null;
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
  let dreamSchema = object({
    title: string().trim().required(),
    dream: string().trim().required(),
    recurrent: boolean().required(),
    nightmare: boolean().required(),
    paralysis: boolean().required(),
    favorite: boolean().required(),
    createdAt: string().trim().required(),
  });

  const validateDream = await dreamSchema.validate({
    title: reqBody.title,
    dream: reqBody.dream,
    recurrent: reqBody.recurrent,
    nightmare: reqBody.nightmare,
    paralysis: reqBody.paralysis,
    favorite: reqBody.favorite,
    createdAt: reqBody.createdAt,
  });

  let image,
    audio = null;
  if (reqBody.image) {
    let fileSchema = object({
      fileType: string().trim().required(),
      fileUrl: string().trim().required(),
      filename: string().trim().required(),
      size: number().positive().integer().required(),
    });
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

const updateDream = (dream: Dream) => {
  return dreamsRepository.updateDream(dream);
};

const deleteDream = (id: string) => {
  return dreamsRepository.deleteDream(id);
};

export default { getDreams, addDream, updateDream, deleteDream };
