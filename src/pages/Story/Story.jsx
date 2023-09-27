import React, { useEffect, useState } from 'react';
import './Story.css';
import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import Next from '../../assests/Images/next.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { compareArrays, replaceAll } from '../../utils/helper';
import Header from '../Header';
import MyStoryimg from '../../assests/Images/DefaultStoryImg.png'

const Story = () => {
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState(''); // blob
  localStorage.setItem('recordedAudio', recordedAudio);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [storycase64Data, setStoryBase64Data] = useState('');
  const { slug } = useParams();
  const [currentLine, setCurrentLine] = useState(0);
  const navigate = useNavigate()
  localStorage.setItem('apphomelang','hi')

  React.useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
    // if ((voiceText !== '') & (voiceText !== '-')) {
    //   go_to_result(voiceText);
    // }
  }, [voiceText]);
  React.useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    localStorage.setItem(
      'virtualStorySessionID',
      localStorage.getItem('virtualID') + '' + Date.now()
    );
    try {
      const response = await fetch(
        `https://telemetry-dev.theall.ai/content-service/v1/WordSentence/pagination?type=Sentence&collectionId=${slug}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          // if(!!localStorage.getItem('contents')){
          //   setPosts(JSON.parse(localStorage.getItem('contents')));
          // }
          // else{
            setPosts(data);
          // }
          // console.log("localStorage.getItem('contents'):-" ,JSON.parse(localStorage.getItem('contents')));
          // console.log("api:-" ,data);
          setLoading(false);
        });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    set_temp_audio(new Audio(posts?.data[currentLine].data[0].hi.audio));
  };

  const pauseAudio = () => {
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setFlag(!flag);
      temp_audio.addEventListener('ended', () => setFlag(true));
    }
  };


  const nextLine = count => {
    if (currentLine < posts?.data?.length ) {
      setCurrentLine(currentLine + 1);
    }
  };
  const prevLine = count => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  };

  function findRegex(str) {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
  }



  function saveIndb(output) {
    // .replace(/[.',|!|?-']/g, '')
    // console.log(output.output);
    const utcDate = new Date().toISOString().split('T')[0];
    axios
      .post(`https://telemetry-dev.theall.ai/learner/scores`, {
        taskType: 'asr',
        output: output.output,
        config: null,
        user_id: localStorage.getItem('virtualID'),
        session_id: localStorage.getItem('virtualStorySessionID'),
        date: utcDate,
        original_text: findRegex(localStorage.getItem('contentText')),
        response_text: findRegex(output.output[0].source),
        language: 'hi',
      })
      .then(res => {
        // console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(()=>{
    if(currentLine === posts?.data?.length){
      navigate('/Results')
    }
  },[currentLine])

  // console.log(posts?.data[currentLine]?.data[0]?.hi?.audio);
  return (
    <>
      <Header />
      {/* <button onClick={GetRecommendedWordsAPI}>getStars</button> */}
      <div style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", }} className="story-container">
        <Flex gap={14}
        >
          {/* <Image
          transform={'scaleX(-1)'}
          h={'32'} Result
          src={Next}
          onClick={prevLine}
          alt="next" />
        <Image h={'32'} src={Next} onClick={nextLine} alt="next" /> */}
          {/* <Image h={'32'} src={Next} onClick={nextLine} alt="next" />  */}
        </Flex>
        <div style={{ boxShadow: "2px 2px 15px 5px grey",border:'2px solid white', borderRadius:"30px"}} className="story-item">
          <div className="row">
            {/* <h1 style={{position:'relative', left:'-100px'}}>{posts?.data[0]?.title}</h1> */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              posts?.data?.map((post, ind) =>
                currentLine === ind ? (
                  <Flex key={ind}>
                    {/* {console.log(post.image)} */}
                    <Image
                      className="story-image"
                      src={post?.image}
                      alt={post?.title}
                    />
                    <Box key={ind}>
                      <Box p="4">
                        <h1 style={{fontSize:'55px', marginTop:'40px'}}>{post?.data[0]?.hi?.text}</h1>
                        {localStorage.setItem(
                          'contentText',
                          post?.data[0]?.hi?.text
                        )} 
                      </Box>
                    </Box>
                  </Flex>
                ) : (
                  ''
                )
              )
            )}
          </div>
          <div style={{display:'flex', gap:"20px", position:'relative', bottom:'-220px', left:'-40%'}}>
{
  currentLine === posts?.data?.length? "":
<>
          {isAudioPlay !== 'recording' && (
            <VStack alignItems="center" gap="5">
              {flag ? (
                <img
                  className="play_btn"
                  src={play}
                  style={{ height: '72px', width: '72px' }}
                  onClick={() => playAudio()}
                  alt="play_audio"
                  />
                  ) : (
                    <img
                    className="play_btn"
                    src={pause}
                    style={{ height: '72px', width: '72px' }}
                    onClick={() => pauseAudio()}
                    alt="pause_audio"
                    />
                    )}
              <h4 className="text-play m-0 " style={{ position: 'relative' }}>
                Listen
              </h4>
            </VStack>
          )}
          <VStack>
            <VoiceCompair
              setVoiceText={setVoiceText}
              setRecordedAudio={setRecordedAudio}
              _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
              flag={true}
              setCurrentLine={setCurrentLine}
              setStoryBase64Data={setStoryBase64Data}
              saveIndb={saveIndb}
              />
            {isAudioPlay === 'recording' ? (
              <h4 style={{position:'relative', top:'-12px'}} className="text-speak m-0">Stop</h4>
              ) : (
                <h4 style={{position:'relative', top:'-12px'}} className="text-speak m-0">Speak</h4>
                )}
          </VStack>
          </>
        }
                </div>
        </div>
        {currentLine === posts?.data?.length? 
        <div className="button-container">
      <Link to={'/Results'}>
      <button className="custom-button">View Result</button>
      </Link>
      <Link to={'/storyList'}>
      <button className="custom-button">Back To StoryList</button>
      </Link>
      </div>:""
      }
      </div>
    </>
  );
};

export default Story;