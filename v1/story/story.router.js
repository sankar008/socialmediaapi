const {createStory, updateStory, getStoryByStoryCode, getStoryByUserCode, deleteStory} = require("./story.controller"); 
const router = require('express').Router();

router.post('/', createStory);
router.get('/:storyCode', getStoryByStoryCode);
router.patch('/', updateStory);
router.get('/user/:userCode', getStoryByUserCode);
router.delete('/', deleteStory);
module.exports = router;