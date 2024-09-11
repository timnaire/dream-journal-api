import { Dream } from "../dream";
import { Media } from "../media";

export interface DreamRequest extends Dream {
  image?: Media;
}
