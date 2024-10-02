export class UserDto {
  static factory(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profession: user.profession,
      balance: user.balance,
      type: user.type,
    }
  }
}