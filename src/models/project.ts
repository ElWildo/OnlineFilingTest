import { WithId, Document, ObjectId } from "mongodb";

/**
 * Defining Project schema with interface
 */

export default interface Project extends WithId<Document> {
  name: string;
  start_date: Date;
  due_date: Date;
  tasks?: ObjectId[];
}

export function instanceOfProject(object: any): object is Project {
  return (
    "name" in object &&
    typeof (object as Project).name == "string" &&
    "start_date" in object &&
    typeof (object as Project).start_date == "string" &&
    "due_date" in object &&
    typeof (object as Project).due_date == "string"
  );
}
