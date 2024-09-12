import { ObjectId, Document } from "mongoose";
import dreamsRepository from "./dreams.repository";
import usersService from "../users/users.service";
import { boolean, number, object, string } from "yup";
import { DreamRequest } from "../../shared/models/request/dream-request";
import { MediaSchema } from "../../shared/schema/media";
import { User } from "../../shared/models/user";
import { UserSchema } from "../../shared/schema/user";
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

const getDreams = async () => {
  const dreams = await dreamsRepository.getDreams();

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
      ...dream.toJSON(),
      user: user?.toModel,
      image: image && image.toDreamModel,
      audio: audio && audio.toDreamModel,
    });
  }

  return newDreams;
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
  console.log("addedDream", addedDream.toJSON);
  const forReturn = { ...addedDream.toJSON(), image, audio };
  console.log("forReturn", forReturn);
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

const deleteDream = async (id: string, username: string) => {
  const user = await usersService.getUserByUsername(username);
  const dream = await dreamsRepository.getDreamById(id);

  const s3 = new S3Service(user?.id);

  if (dream?.imageId) {
    const image = await dreamsRepository.getDreamMediaById(String(dream.imageId));
    if (image) {
      await s3.delete(image.filename);
      await dreamsRepository.deleteMedia(String(dream.imageId));
    }
  }

  if (dream?.audioId) {
    const audio = await dreamsRepository.getDreamMediaById(String(dream.audioId));
    if (audio) {
      await s3.delete(audio.filename);
      await dreamsRepository.deleteMedia(String(dream.audioId));
    }
  }

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
