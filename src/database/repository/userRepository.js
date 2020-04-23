const { User } = require('@src/database/models/user');

const userRepo = {};

userRepo.exists = (condition) => User.count({ where: condition });

userRepo.getUserByEmail = (email) => User.findOne({ where: { email } });

userRepo.getUserByPhone = (phone) => User.findOne({ where: { phone } });

userRepo.getPaginatedUsers = (limit, offset) => {
  const paginate = { offset, limit };
  return User.findAll({
    ...paginate,
    order: [['id', 'ASC']]
  });
};

userRepo.getAllUsers = () => User.findAll();

userRepo.createUser = (user) => User.create(user);

userRepo.getUserByPk = (id) => User.findByPk(id);

userRepo.updateUserByID = (user, id) => User.update(user, { where: { id } });

module.exports = userRepo;
