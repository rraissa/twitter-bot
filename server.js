var Twit = require('twit')

var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

function random_from_array(images){
  return images[Math.floor(Math.random() * images.length)];
}

function upload_random_image(images){
 
	var stream = T.stream('user');
	stream.on('tweet', tweetEvent);

	function tweetEvent(eventMsg){
	
	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name; // we need this to get the bot to reply to specific users (in this case, when a user mentions the bot)
	var nameID = eventMsg.id_str;


// replace "mybot" with your bot's username, this is to prevent the bot from endlessly tweeting itself
// when making threads or replying to your own tweet 
	if(from != 'mybot'){ 
	if(replyto == 'mybot'){

	console.log('Opening an image...');
  // we're getting images from our "images" file, if your file has a different name, change "images" to your file name 
  	var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
     	b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  	console.log('Uploading an image...');

	T.post('media/upload', { media_data: b64content }, function (err, data, response){
    		if (err){
      			console.log('ERROR:');
      			console.log(err);
    		}
    		else{
     			 console.log('Image uploaded!');
     			 console.log('Now tweeting it...');

			var status = {
				status: '@' + from,
				media_ids: data.media_id_string
			}


			T.post('statuses/update', {in_reply_to_status_id: nameID, status: '@' + from, media_ids: data.media_id_string}, function(err, data, response){
				if (err){
            				console.log('ERROR:');
            				console.log(err);
          			}
          			else{
           				 console.log('Posted an image!');
          			}
        		});
    		}
  	});
	}
	}
	}
}

fs.readdir(__dirname + '/images/', function(err, files) {  // change "images" to the name of your file containing images if different
  if (err){
    console.log(err);
  }
  else{
    var images = [];
    files.forEach(function(f) {
      images.push(f); 
    });

    setTimeout(function(){
      upload_random_image(images);
    }, 10000);
  }
});


