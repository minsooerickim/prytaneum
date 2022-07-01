/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectionFromArray, fromGlobalId } from 'graphql-relay';
import { Resolvers, toGlobalId, runMutation } from '@local/features/utils';
import { CookieSerializeOptions } from 'fastify-cookie';
import * as User from './methods';
import { errors } from '../utils';

const toUserId = toGlobalId('User');
const toOrgId = toGlobalId('Organization');

const cookieOptions: CookieSerializeOptions = {
    sameSite: 'lax'
}

export const resolvers: Resolvers = {
    Query: {
        async me(parent, args, ctx, info) {
            if (!ctx.viewer.id) return null; // can't lookup "me" if not logged in
            const user = await User.findUserById(ctx.viewer.id, ctx.prisma);
            return toUserId(user);
        }
    },
    User: {
        async organizations(parent, args, ctx, info) {
            const { id: userId } = fromGlobalId(parent.id);
            const userOrgs = await User.findOrgsByUserId(userId, ctx.prisma);
            if (!userOrgs) return null;
            return connectionFromArray(userOrgs.map(toOrgId), args);
        },
        async isOrganizer(parent, args, ctx, info) {
            if (!ctx.viewer.id) { return false; }
            return User.isOrganizer(ctx.viewer.id, ctx.prisma);
        },
    },
    Mutation: {
        async register(parent, args, ctx, info) {
            return runMutation(async () => {
                const { registeredUser, token } = await User.registerSelf(ctx.prisma, args.input);
                ctx.reply.setCookie('jwt', token, cookieOptions);
                return toUserId(registeredUser);
            });
        },
        async login(parent, args, ctx, info) {
            return runMutation(async () => {
                const { user, token } = await User.loginWithPassword(ctx.prisma, args.input);
                ctx.reply.setCookie('jwt', token, cookieOptions);
                return toUserId(user);
            });
        },
        logout(parent, args, ctx, info) {
            ctx.reply.clearCookie('jwt', cookieOptions);
            return new Date();
        },
        async updateEmail(parent, args, ctx, info) {
            return runMutation(async () => {
                const { updatedUser, token } = await User.updateEmail(ctx.prisma, args.input);
                ctx.reply.setCookie('jwt', token, cookieOptions);
                return toUserId(updatedUser);
            });
        },
        async updatePassword(parent, args, ctx, info) {
            return runMutation(async () => {
                const { updatedUser, token } = await User.updatePassword(ctx.prisma, args.input);
                ctx.reply.setCookie('jwt', token, cookieOptions);
                return toUserId(updatedUser);
            });
        },
        async deleteAccount(parent, args, ctx, info) {
            return runMutation(async () => {
                const { deletedUser } = await User.deleteAccount(ctx.prisma, args.input);
                ctx.reply.clearCookie('jwt', cookieOptions);
                return toUserId(deletedUser);
            });
        },
        async makeOrganizer(parent, args, ctx, info) {
            return runMutation(async () => {
                if (!ctx.viewer.id) throw new Error(errors.noLogin);
                const updatedUser = await User.makeOrganizer(ctx.prisma, args.input, ctx.viewer.id);
                return toUserId(updatedUser);
            })
        },
        async removeOrganizer(parent, args, ctx, info) {
            return runMutation(async () => {
                if (!ctx.viewer.id) throw new Error(errors.noLogin);
                const updatedUser = await User.removeOrganizer(ctx.prisma, args.input, ctx.viewer.id);
                return toUserId(updatedUser);
            })
        }
    },
};
