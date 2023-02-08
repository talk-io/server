import { MessageDto } from "../guilds/channels/messages/dto/message.dto";

export namespace Events {
  export enum UserEvents {
    INIT = "init",
    UPDATE = "update",
    UPDATE_STATUS = "updateStatus",
    UPDATE_AVATAR = "updateAvatar",
  }

  export enum GuildUserEvents {
    JOIN_GUILD = "guildUserJoin",
    LEAVE_GUILD = "guildUserLeave",
    KICK = "guildUserKick",
    BAN = "guildUserBan",
    UNBAN = "guildUserUnban",
    UPDATE = "guildUserUpdate",
  }

  export enum GuildEvents {
    GUILD_UPDATED = "guildUpdated",
    GUILD_DELETED = "guildDeleted",
  }

  export enum ChannelEvents {
    GET_CHANNELS = "getChannels",
    GET_CHANNEL = "getChannel",
    CHANNEL_CREATED = "channelCreated",
    CHANNEL_UPDATED = "channelUpdated",
    CHANNEL_DELETED = "channelDeleted",
    USER_TYPING_START = "userTypingStart",
    USER_TYPING_END = "userTypingEnd",
  }

  export enum MessageEvents {
    MESSAGE_CREATED = "messageCreated",
    MESSAGE_UPDATED = "messageUpdated",
    MESSAGE_DELETED = "messageDeleted",
  }
}

interface ServerToClientEvents {
  [Events.UserEvents.INIT]: () => void;
  [Events.MessageEvents.MESSAGE_CREATED]: (message: MessageDto) => void;
}

export interface UserTyping {
  userID: string;
  channelID: string;
}

export interface ClientToServerEvents {
  [Events.ChannelEvents.USER_TYPING_START]: (user: UserTyping) => void;
  [Events.ChannelEvents.USER_TYPING_END]: (user: UserTyping) => void;
}
