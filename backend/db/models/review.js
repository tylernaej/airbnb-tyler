'use strict';
const {
  Model, Sequelize 

} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'}),
      Review.belongsTo(models.User, {foreignKey: 'userId'}),
      Review.hasMany(models.Image, {foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true})
    }
  }
  Review.init({
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};