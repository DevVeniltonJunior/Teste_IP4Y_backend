import { User } from '@/domain/entities'
import { CreateUser } from '@/domain/usecases'
import { UserBirthdate, UserCPF, UserEmail, UserFirstName, UserGender, UserId, UserLastName } from '@/domain/valueObjects'
import { UserCommandRepository } from '@/infra/repositories'
import { TCreateUser, TRoute, Response } from '@/presentation/protocols'

export class CreateUserController {
  public static async handle(req: TRoute.handleParams<TCreateUser.Request.body, TCreateUser.Request.params, TCreateUser.Request.query>): Promise<Response<TCreateUser.Response>> {
    const userParam = req.body

    const repository = new UserCommandRepository()
    const createUser = new CreateUser(repository)

    try {
      if(!userParam.id || !userParam.cpf || !userParam.fist_name || !userParam.last_name || !userParam.birthdate || !userParam.email || !userParam.gender) return {
        statusCode: 400,
        data: { message: 'Bad Request'}
      }

      const entity = await createUser.execute(new User(
        new UserId(userParam.id),
        new UserCPF(userParam.cpf),
        new UserFirstName(userParam.fist_name),
        new UserLastName(userParam.last_name),
        new UserBirthdate(userParam.birthdate),
        new UserEmail(userParam.email),
        new UserGender(userParam.gender)
      ))
  
      return {
        statusCode: 201,
        data: entity
      }
    } catch {
      return {
        statusCode: 500,
        data: { message: 'Server Error'}
      }
    }
  }
}