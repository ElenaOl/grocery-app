'use strict';
module.exports = (sequelize, DataTypes) => {
  var mylistsUsers = sequelize.define('mylistsUsers', {
    userId: DataTypes.INTEGER,
    mylistId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return mylistsUsers;
};