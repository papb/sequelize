'use strict';

const chai = require('chai');
const Sequelize = require('../../index');
const expect = chai.expect;
const Support = require('./support');
const DataTypes = require('../../lib/data-types');

describe(Support.getTestDialectTeaser('Model'), () => {

  beforeEach(function() {
    this.User = this.sequelize.define('User', {
      username: DataTypes.STRING,
      secretValue: DataTypes.STRING,
      data: DataTypes.STRING,
      intVal: DataTypes.INTEGER,
      theDate: DataTypes.DATE,
      aBool: DataTypes.BOOLEAN
    });

    return this.User.sync({ force: true });
  });

  describe('build', () => {

    it('fills the objects with default values', function() {
      const Task = this.sequelize.define('TaskBuild', {
        title: { type: Sequelize.STRING, defaultValue: 'a task!' },
        foo: { type: Sequelize.INTEGER, defaultValue: 2 },
        bar: { type: Sequelize.DATE },
        foobar: { type: Sequelize.TEXT, defaultValue: 'asd' },
        flag: { type: Sequelize.BOOLEAN, defaultValue: false }
      });

      expect(Task.build().title).to.equal('a task!');
      expect(Task.build().foo).to.equal(2);
      expect(Task.build().bar).to.not.be.ok;
      expect(Task.build().foobar).to.equal('asd');
      expect(Task.build().flag).to.be.false;
    });
    
    it('should properly work with GROUP BY', function() {
      const sequelize = this.sequelize;
      const User = this.sequelize.define('User', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING }
      });

      const Project = this.sequelize.define('Project', {
        name: { type: DataTypes.STRING}
      });

      User.hasMany(Project);

      return this.sequelize.sync({ force: true }).then(() => {
        return User.bulkCreate([
          { name: 'Alpha' },
          { name: 'Bravo' },
          { name: 'Charlie' },
        ]);
      }).then(() => {
        return Project.bulkCreate([
          { name: 'foo', UserId: 1},
          { name: 'bar', UserId: 2},
        ]);
      }).then(() => {
        return User.findAndCountAll({
          subQuery: false,
          attributes: [
            'name',
            [sequelize.fn('COUNT', sequelize.col('projects.id')), 'project_count']
          ],
          include: [{
            attributes: [],
            model: Project
          }],
          limit: 2,
          offset: 0,
          group: [sequelize.col('user.id')]
        });
      }).then(result => {
        expect(result.count).to.equal(3);
        expect(result.rows.length).to.equal(2);
      });
    });

  });
});
