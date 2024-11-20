import { WithId, Document, ObjectId } from "mongodb";

/**
 * Defining Task schema with interface
 */

export default interface Task extends WithId<Document> {
  name: string;
  doneStatus: "done" | "to-do";
  start_date: Date;
  due_date: Date;
  done_date: Date;
  project?: ObjectId;
}

export function instanceOfTask(object: any): object is Task {
  return (
    "name" in object &&
    typeof (object as Task).name == "string" &&
    "doneStatus" in object &&
    ((object as Task).doneStatus == "done" ||
      (object as Task).doneStatus == "to-do") &&
    "start_date" in object &&
    typeof (object as Task).start_date == "string" &&
    "due_date" in object &&
    typeof (object as Task).due_date == "string" &&
    "done_date" in object &&
    typeof (object as Task).done_date == "string"
  );
}
