export namespace Events {
    export enum GuildEvents {
        GET_GUILDS = 'getGuilds',
        GET_GUILD = 'getGuild',
        GUILD_CREATED = 'guildCreated',
        GUILD_JOINED = 'guildJoined',
        GUILD_LEFT = 'guildLeft',
        GUILD_UPDATED = 'guildUpdated',
        GUILD_DELETED = 'guildDeleted',
        GUILD_MEMBER_ADDED = 'guildMemberAdded',
        GUILD_MEMBER_REMOVED = 'guildMemberRemoved',
    }

    export enum ChannelEvents {
        GET_CHANNELS = 'getChannels',
        GET_CHANNEL = 'getChannel',
        CHANNEL_CREATED = 'channelCreated',
        CHANNEL_UPDATED = 'channelUpdated',
        CHANNEL_DELETED = 'channelDeleted',
    }

    export enum MessageEvents {
        GET_MESSAGES = 'getMessages',
        MESSAGE_CREATED = 'messageCreated',
        MESSAGE_UPDATED = 'messageUpdated',
        MESSAGE_DELETED = 'messageDeleted',
    }
}