export interface CommentData {
  name: string;
  comment: string;
  timestamp: Date;
  id?: string;
}

export interface ServerToClientEvents {
  receive_comment: (data: CommentData) => void;
}

export interface ClientToServerEvents {
  send_comment: (data: CommentData) => void;
}
