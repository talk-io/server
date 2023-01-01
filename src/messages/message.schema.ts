import {Prop, Schema} from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Message {
    @Prop({
        unique: true,
    })
    id: string;

    @Prop()
    authorID: string;

    @Prop()
    content: string;

    @Prop()
    channelID: string;

    @Prop()
    guildID: string;
}
