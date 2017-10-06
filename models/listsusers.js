'use strict';
module.exports = (sequelize, DataTypes) => {
  var listsUsers = sequelize.define('listsUsers', {
    listId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return listsUsers;
};