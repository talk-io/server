import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({
        required: true,
    })
    email: string;

    @Prop()
    username: string;

    @Prop()
    discriminator: number;

    @Prop({required: true})
    password: string;

    @Prop()
    tokens: Array<string>;

    generateAuthToken: () => Promise<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY, {expiresIn: "30d"});
    user.tokens.push(token);

    await user.save();
    return token;
}

UserSchema.pre("save", async function (next) {
    const user = this;

    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, +process.env.HASH_ROUNDS);
    }

    next();
})