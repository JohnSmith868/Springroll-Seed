/* global require */
import './components.js';
import './styles.css';
import {Game} from 'platypus';

const packageData = require('../package.json'),
    config = {
        levels: {},
        spriteSheets: {},
        atlases: {},
        skeletons: {}
    },
    flatten = {
        entities: true,
        scenes: true
    },
    importJSON = function (r, config) {
        r.keys().forEach((key) => {
            var arr = key.split('/'),
                i = 0,
                props = config,
                last = arr.length - 1;

            for (i = 0; i < last; i++) {
                if (arr[i] !== '.') {
                    if (!props[arr[i]]) {
                        props[arr[i]] = {};
                    }

                    props = props[arr[i]];

                    if (flatten[arr[i]]) {
                        break;
                    }
                }
            }
            props[arr[last].replace('.json', '')] = r(key);
        });
    },
    importTEXT = function (r, config) {
        r.keys().forEach((key) => {
            var arr = key.split('/'),
                last = arr.length - 1;
            
            config[arr[last].substring(0, arr[last].length - 6)] = r(key).default;
        });
    };

// Base configuration
importJSON(require.context(
    "./config/", // context folder
    true, // include subdirectories
    /.*\.json/ // RegExp
), config);

// Sprite Sheets
importJSON(require.context(
    "../assets/images/", // context folder
    true, // include subdirectories
    /.*\.json/ // RegExp
), config.spriteSheets);

// levels
importJSON(require.context(
    "../assets/levels/", // context folder
    true, // include subdirectories
    /.*\.json/ // RegExp
), config.levels);

// spine skeleton files
importJSON(require.context(
    "../assets/spine/", // context folder
    true, // include subdirectories
    /.*\.json/ // RegExp
  ), config.skeletons);

// spine atlas files
importTEXT(require.context(
    "../assets/spine/", // context folder
    true, // include subdirectories
    /.*\.atlas/ // RegExp
  ), config.atlases);

const game = new Game(config, {
    canvasId: 'stage',
    display: {
        clearView: true,
        aspectRatio: "4:3-2:1"
    },
    audio: 'assets/audio/',
    images: 'assets/images/',
    name: packageData.name,
    version: packageData.version
});

game.loadScene('title-scene');