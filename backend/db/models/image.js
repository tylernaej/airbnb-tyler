'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    static associate(models) {
      Image.belongsTo(models.User, {foreignKey: 'userId'}),
      Image.belongsTo(models.Spot, {foreignKey: 'spotId'}),
      Image.belongsTo(models.Review, {foreignKey: 'reviewId'})
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previewImage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Image',
  });
  return Image;
};