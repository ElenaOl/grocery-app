'use strict';
module.exports = (sequelize, DataTypes) => {
  var mylist = sequelize.define('mylist', {
    myListName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.mylist.belongsToMany(models.user, {through: "mylistsUsers"});
        models.mylist.belongsTo(models.user);
        models.mylist.hasMany(models.list);
      }
    }
  });
  return mylist;
};