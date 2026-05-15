import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UpdateUserInput } from "../dtos/input/user.input.js";
import { GqlUser } from "../graphql/decorators/user.decorator.js";
import { IsAuth } from "../middlewares/auth.middleware.js";
import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/user.service.js";

@Resolver()
export class UserResolver {
	private userService = new UserService();

	@Query(() => UserModel)
	@UseMiddleware(IsAuth)
	async getProfile(@GqlUser() user: UserModel): Promise<UserModel> {
		return this.userService.getProfile(user.id);
	}

	@Mutation(() => UserModel)
	@UseMiddleware(IsAuth)
	async updateProfile(
		@Arg("data", () => UpdateUserInput) data: UpdateUserInput,
		@GqlUser() user: UserModel,
	): Promise<UserModel> {
		return this.userService.updateProfile(user.id, data);
	}
}
