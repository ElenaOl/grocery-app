'use strict';
module.exports = (sequelize, DataTypes) => {
  var item = sequelize.define('item', {
    itemName: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.item.belongsTo(models.list);
      }
    }
  });
  return item;
};