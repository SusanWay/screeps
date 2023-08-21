import {prototypes, utils, constants} from 'game';

var bodyHorvestCreep = [constants.MOVE, constants.WORK, constants.CARRY]
var bodyAtackCreep = [constants.MOVE, constants.ATTACK]
const spawnCreeps = (spawn, bodyParts) => {
    return spawn.spawnCreep(bodyParts).object;
}

const findCreepsByType = (creeps, type) => {
    let result = []
    for(var creep of creeps){
        if(creep.body.some(bodyPart => bodyPart.type == type)){
            result.push(creep);
        }
    }
    return result
}
const horvestEnerge = (creepArr, source, spawn) => {
    for (var creep of creepArr) {
        if (creep.store.getFreeCapacity(constants.RESOURCE_ENERGY)) {
            if (creep.harvest(source) === constants.ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (creep.transfer(spawn, constants.RESOURCE_ENERGY) === constants.ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }
}

const protectBase = (creepArr) => {
    for (var creep of creepArr) {
        let targets = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);
        let targetsInRange = utils.findInRange(creep, targets, 15);
        if (targetsInRange.length) {
            let closestEnemy = creep.findClosestByPath(targets)
            if (creep.attack(closestEnemy) == constants.ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnemy);
            }
        }
    }
}

const getMyCreeps = () => {
    return utils.getObjectsByPrototype(prototypes.Creep).filter(creep => creep.my)
}
export function loop() {

    var mySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn)[0];
    var mySource = utils.getObjectsByPrototype(prototypes.Source)[0]
    var myHorvestCreeps = findCreepsByType(getMyCreeps(), constants.WORK)
    var myAttacCreeps = findCreepsByType(getMyCreeps(), constants.ATTACK)

    if(myHorvestCreeps.length < 2){
        myHorvestCreeps.push(spawnCreeps(mySpawn, bodyHorvestCreep))
    }else{
        if(myAttacCreeps.length < 4){
            myAttacCreeps.push(spawnCreeps(mySpawn, bodyAtackCreep))
        }
    }
    if(myHorvestCreeps.length){
        horvestEnerge(myHorvestCreeps, mySource, mySpawn)
    }

    if(myAttacCreeps.length){
        protectBase(myAttacCreeps, mySource, mySpawn)
    }

}
