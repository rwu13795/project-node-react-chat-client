import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setFriendsOnlineStatus } from "../../../redux/user/userSlice";

import { onlineEcho_emitter } from "../../emitters";

interface Data {
  sender_id: string;
  status: string;
}
// whenever a friend is online, his/her client will emit the online message.
// listen to that message, and mark this friend as online in the store
export function online_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("online", ({ sender_id, status }: Data) => {
    dispatch(setFriendsOnlineStatus({ sender_id, status }));

    // let the friend who just logged in know that the current user is online also
    onlineEcho_emitter(socket, { friend_id: sender_id });
  });
}

/* 
  Tried to use Class approach
  But redux "dispatch" can only be passed to a function not a constructor
  So I have to use the function approach to create all the listener and emitter

  //--------------------- Example code ---------------------//

interface SocketEvent {
  subject: Subjects; // the subject that a particular listener is on
  data: any; // the data that are passed from/to client
}

export abstract class Listener<T extends SocketEvent> {
  abstract subject: T["subject"]; // must be a subject type in the Event
  // the callback which handles the data passed from client
  abstract eventCallback(data: T["data"]): void;

  protected socket: Socket;
  protected dispatch: Dispatch;

  constructor(socket: Socket, dispatch: Dispatch<any>) {
    this.socket = socket;
    this.dispatch = dispatch;
  }

  listen() {
    this.socket.on(this.subject as string, this.eventCallback);
    console.log("listener is on", this.subject);
  }
}


  interface Online_Event {
  subject: Subjects;
  data: {
    sender_id: string;
    status: string;
  };
}

export class Online_Listener extends Listener<Online_Event> {
  readonly subject = Subjects.online;

  eventCallback({ sender_id, status }: Online_Event["data"]): void {
    console.log(
      `user ${sender_id} just emit "online" as ${status}, let him know I am online`
    );
    this.dispatch(setFriendsOnlineStatus({ sender_id, status }));

    // let the friend who just logged in know that the current user is online also
    onlineEcho_emitter(this.socket, { friend_id: sender_id });
  }
}

*/
