var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));
var moment = require('moment');


describe('Current', function() {
	var env = {};
    beforeEach(function() {
    	env = {};
        env.log = require('./mocks/log.js')();
        
        env.key = 'lb.app.current';
        
        env.data = {
        	battle: {
            	id: 1,
            },
            scenario: {
            	id: 2,
            	start: {
                	year: 1806,
                    month: 11,
                    day: 15,
                    hour: 7,
                    minute: 20
                },
            	end: {
                	year: 1806,
                    month: 11,
                    day: 15,
                    hour: 11,
                    minute: 00
                }
            }
        };
        
        env.Battles = {
        	findByScenario: sinon.stub().returns(env.data)
        };
        
        env.localStorage = {
        	getItem: sinon.stub(),
            setItem: sinon.stub()
        };
        
        env.saved = {
        	battle: env.data.battle.id,
        	scenario: env.data.scenario.id,
            turn: 1,
            phase: 0
        };
        
		env.Current = sandbox.require('../core/current.js', {
        	requires: {
            	'../core/battles.js': env.Battles,
            	'../core/log.js': env.log,
                'moment': moment,
            },
            globals: {
            	localStorage: env.localStorage
            }
        });
    });
    
	describe('get', function() {
    	describe('not previously saved', function() {
	    	beforeEach(function() {
            	env.localStorage.getItem.returns(null);
	        	env.current = env.Current.get(env.data);
	        });
            it('should retrieve from local storage', function() {
            	expect(env.localStorage.getItem).to.have.been.calledOnce;
            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
            });
            
            it('should save new to local storage', function() {
            	expect(env.localStorage.setItem).to.have.been.calledOnce;
            	expect(env.localStorage.setItem).to.have.been.calledWith(env.key, JSON.stringify({
                	battle: env.data.battle.id,
                	scenario: env.data.scenario.id,
                    turn: 1,
                    phase: 0
                }));
            });
            
            it('should retrieve the object', function() {
            	expect(env.current).to.deep.equal({
                	battle: env.data.battle.id,
                	scenario: env.data.scenario.id,
                    turn: 1,
                    phase: 0
                });
            });
        });
        
    	describe('previously saved', function() {
	    	beforeEach(function() {
            	env.localStorage.getItem.returns(JSON.stringify(env.saved));
	        	env.current = env.Current.get(env.data);
	        });
            it('should retrieve from local storage', function() {
            	expect(env.localStorage.getItem).to.have.been.calledOnce;
            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
            });
            
            it('should not save new to local storage', function() {
            	expect(env.localStorage.setItem).to.not.have.been.called;
            });
            
            it('should retrieve the object', function() {
            	expect(env.current).to.deep.equal(env.saved);
            });
        });
    });
    
	describe('reset', function() {
    	beforeEach(function() {
        	env.localStorage.getItem.returns(JSON.stringify(env.saved));
        	env.current = env.Current.reset(env.data);
        });
        it('should save new to local storage', function() {
        	expect(env.localStorage.setItem).to.have.been.calledOnce;
        	expect(env.localStorage.setItem).to.have.been.calledWith(env.key, JSON.stringify({
            	battle: env.data.battle.id,
            	scenario: env.data.scenario.id,
                turn: 1,
                phase: 0
            }));
        });
        
        it('should retrieve from local storage', function() {
        	expect(env.localStorage.getItem).to.have.been.calledOnce;
        	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
        });
        
        it('should retrieve the object', function() {
        	expect(env.current).to.deep.equal({
            	battle: env.data.battle.id,
            	scenario: env.data.scenario.id,
                turn: 1,
                phase: 0
            });
        });
    });
    
	describe.only('turn', function() {
    	describe('current', function() {
	    	describe('use saved', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.turn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:20 AM');
		            });
	            });
	            
	        	describe('5', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 5;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.turn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 08:40 AM');
		            });
	            });
	        });
	        
	        
	    	describe('use local', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
			        	env.turn = env.Current.turn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.calledOnce;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:20 AM');
		            });
	            });
	            
	        	describe('5', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 5;
			        	env.turn = env.Current.turn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.calledOnce;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 08:40 AM');
		            });
	            });
	        });
	    });
        
    	describe('previous', function() {
	    	describe('use saved', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.prevTurn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:20 AM');
		            });
                    
			        it('should save to local storage', function() {
			        	expect(env.localStorage.setItem).to.have.been.called;
			        });
	            });
                
	        	describe('5', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 5;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.prevTurn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 08:20 AM');
		            });
                    
			        it('should save to local storage', function() {
			        	expect(env.localStorage.setItem).to.have.been.called;
			        });
	            });
		    });
            
	    	describe('use local', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
			        	env.turn = env.Current.prevTurn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.calledOnce;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:20 AM');
		            });
                    
			        it('should not save to local storage', function() {
			        	expect(env.localStorage.setItem).to.not.have.been.called;
			        });
	            });
                
	        	describe('5', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 5;
			        	env.turn = env.Current.prevTurn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.calledOnce;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledOnce;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 08:20 AM');
		            });
                    
			        it('should not save to local storage', function() {
			        	expect(env.localStorage.setItem).to.not.have.been.called;
			        });
	            });
		    });
            
	    });
        
    	describe('next', function() {
	    	describe('use saved', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.nextTurn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledTwice;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:40 AM');
		            });
                    
			        it('should save to local storage', function() {
			        	expect(env.localStorage.setItem).to.have.been.called;
			        });
	            });
                
	        	describe('12', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 12;
		        		env.localStorage.getItem.returns(JSON.stringify(env.saved));
			        	env.turn = env.Current.nextTurn();
			        });
		            
		            it('should retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.have.been.calledOnce;
		            	expect(env.localStorage.getItem).to.have.been.calledWith(env.key);
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledTwice;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 11:00 AM');
		            });
                    
			        it('should save to local storage', function() {
			        	expect(env.localStorage.setItem).to.have.been.called;
			        });
	            });
		    });
            
            
	    	describe('use local', function() {
	        	describe('1', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 1;
			        	env.turn = env.Current.nextTurn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.called;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledTwice;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 07:40 AM');
		            });
                    
			        it('should not save to local storage', function() {
			        	expect(env.localStorage.setItem).to.not.have.been.called;
			        });
	            });
                
	        	describe('12', function() {
			    	beforeEach(function() {
	                    env.saved.turn = 12;
			        	env.turn = env.Current.nextTurn(env.saved);
			        });
		            
		            it('should not retrieve from local storage', function() {
		            	expect(env.localStorage.getItem).to.not.have.been.calledOnce;
		            });
		            
		            it('should retrieve the scenario', function() {
		            	expect(env.Battles.findByScenario).to.have.been.calledTwice;
		            	expect(env.Battles.findByScenario).to.have.been.calledWith(env.saved.scenario);
		            });
		            
		            it('should retrieve the turn', function() {
	                	expect(env.turn).to.be.a.string;
		            	expect(env.turn).to.equal('Nov 15, 1806 11:00 AM');
		            });
                    
			        it('should not save to local storage', function() {
			        	expect(env.localStorage.setItem).to.not.have.been.called;
			        });
	            });
		    });
            
	    });
        
    });
    
    /*
    phase: function(current) {
    prevPhase: function(current) {
    nextPhase: function(current) {
    
    : function(current) {
    prevTurn: function(current) {
    nextTurn: function(current) {
    
    */
    
});