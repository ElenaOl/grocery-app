'use strict';
module.exports = (sequelize, DataTypes) => {
  var list = sequelize.define('list', {
    itemName: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return list;
};