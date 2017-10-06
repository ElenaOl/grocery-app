'use strict';
module.exports = (sequelize, DataTypes) => {
  var list = sequelize.define('list', {
    listName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.list.belongsToMany(models.user, {through: "listsUsers"});
        models.list.hasMany(models.item);
      }
    }
  });
  return list;
};