import { ObjectId } from "mongoose";
import { Dream } from "../../shared/models/dream";
import dreamsRepository from "./dreams.repository";
import usersService from "../users/users.service";

const getDreams = async () => {
  const dreams = await dreamsRepository.getDreams();

  let newDreams = [];
  for (let dream of dreams) {
    const user = await usersService.getUser(String(dream.userId));
    newDreams.push({ ...dream.toModel, user: user?.toModel });
  }

  return newDreams;
};

const addDream = (id: ObjectId, dream: Dream) => {
  return dreamsRepository.addDream(id, dream);
};

const updateDream = (dream: Dream) => {
    return dreamsRepository.updateDream(dream);
};

const deleteDream = (id: string) => {
  return dreamsRepository.deleteDream(id);
};

export default { getDreams, addDream, updateDream, deleteDream };
