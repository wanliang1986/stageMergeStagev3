import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import i18n from '../../../i18n';

import Scrollbars from 'react-custom-scrollbars';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import PrimaryButton from '../../../components/particial/PrimaryButton';

const styles = {
  root: {
    padding: 24,
    maxWidth: 530,
  },
  subTitle: {
    fontSize: 13,
  },
  buttonContainer: {
    margin: '0 -4px',
    flexWrap: 'wrap',
    display: 'flex',
  },
  button: {
    margin: 4,
    '&$active': {
      boxShadow: 'none',
      // textTransform: 'c',
      backgroundColor: '#27b872',
      border: '1px solid #27b872',
      color: 'white',
      '&:hover': {
        backgroundColor: '#27b872',
        // borderColor: '#0062cc',
      },
      '&:focus': {
        boxShadow: 'none',
      },
    },
  },
  active: {},
  scripts: {
    padding: '8px 16px 8px 8px',
    whiteSpace: 'pre-wrap',
  },
};

const contents_en = {
  topics: [
    'Cold Call',
    'Resume',
    'Background check',
    'Not interested',
    'Invitation',
    'Open to all',
    'Recommended by competitors',
    'Arrange an interview',
  ],
  scripts: {
    'Cold Call':
      '• Hello XX, I am  XXX a consulting headhunter of XX(company), focusing on the field of XXX (my colleague XX had contacted you)\n' +
      '• Are you still working at XX(company), as a XXX  (position)? What kind of opportunities would be more attractive to you based your future plans?\n' +
      '• Could you briefly introduce yourself? (learning more about the work experience and academic background)\n' +
      '• What are your main responsibilities in the past 12 months?\n' +
      '• Ok, I will send you some of the positions we are hiring soon.\n' +
      '• Is your email still XX@XXXXX.XX?\n' +
      '• Finally, there are a few more information to confirm with you (additional missing info)\n' +
      '• Could you update your latest resume with me? We hope to know you better and help you find a suitable position.\n' +
      '• Are there any other opportunities reach out you recently?\n',
    Resume:
      'Attention:\n' +
      "1. Keep language simple, direct, don't start with a story\n" +
      "2. Don't stand against the candidate\n" +
      '3. Pay attention to tones\n' +
      "4. Don't provide information too early（出牌太快）, control the rhythm\n" +
      "5. Don't give the candidate chances to find excuses.\n",
    'Background check':
      '• Inform cdd, call the PERSON (who is in the cdd previous company, might be an HR). First, introduce yourself including your job function and then show your intentions \n' +
      '• Ask questions about cdd. That PERSON might provide a lot of information in one time, and this might disrupt the question sequence of consultant(you), you need pay attention to the answer and record information to make sure no missing information\n' +
      "• Some sensitive questions may not be answered directly by the third party. For example, what kind of mistakes did the cdd do when he/she works with you? Chinese people's habits will be evasive, we might have doubts, but please respect the answers and try to make a true record.\n" +
      "• At the end of the call, don't forget to say: Is there anything that I could help you? Like career development or talent recruitment?\n" +
      '• Tell the third party: if they are concerned about the process of the cdd, we could update some information after a period of time, if necessary.\n',
    'Not interested':
      "• It doesn't matter, as you know, we are headhunter focused on the XXX (field). What kind of information would you be interested in on the market?\n" +
      '• I am still curious why you are not concerned about opportunities outside?\n' +
      '• What are your next major tasks in the current company?\n' +
      '• I will send you some of the positions we are hiring soon.\n' +
      '• Is your email still XX@XXXXX.XX?\n' +
      '• Do you think this position would be suitable for your friends? (If the position is introduced)\n' +
      '• Finally, there are a few more information to confirm with you (additional missing info)\n' +
      '• Could you update your latest resume with me? We hope to know you better and help you find a suitable position.\n' +
      '• Are there any other opportunities reach out you recently?\n',
    Invitation:
      '• As you know, we are headhunter focused on the XXX (field). I have looked at your resume, your past experience impressed me a lot and I would like to introduce you to our consultants.\n' +
      '• My consultant is XXX(understand the background of the consultant, sort out the Selling Point), Would you be available at (time, as detailed as possible)? I will schedule with our consultant later.\n' +
      '• We want to not only talk with you about this position but also hope that we can really help you in your future career path.\n' +
      '• Could you update your latest resume with me? We hope to know you better and help you find a suitable position.\n' +
      '• Are there any other opportunities reach out you recently?\n' +
      '• Please try your best to help candidates without other purposes (不要功力地对待候选人), and respect each candidate.\n',
    'Open to all':
      '• I would like to provide you with some positions that you might be interested in.\n' +
      '• If you were open to opportunities, could you tell me three aspects that you most concerned? why?\n' +
      '• What kind of opportunities have you seen recently? Which one you are most interested in? why?\n' +
      '• Could you update your latest resume with me? We hope to know you better and help you find a suitable position.\n' +
      '• Are there any other opportunities reach out you recently?\n' +
      '• Help candidates sort out the needs through questions. If his/her background is good, please arrange a consultant interview to help them sort out his/her needs.\n',
    'Recommended by competitors':
      '• Have you talked about this position with HR (competitor) yet?  \n' +
      '• How do you understand this position? (What is the challenge of this position for you?)\n' +
      '• Will you consider this position?\n' +
      '• Could you update your latest resume with me? We hope to know you better and help you find a suitable position.\n' +
      '• Are there any other opportunities reach out you recently?\n',
    'Arrange an interview':
      '• Hello, I am XXX who consulted XXX. Are you available to talk on the phone right now?\n' +
      '• I have referred to the XXX (position) of XXX (company) for you. The company thinks your background is suitable for this position. Do you have time to grab a coffee(have some coffee) or come to the office talk about this position?\n' +
      '• Would you be available at (time)?\n' +
      '• If you prefer, I would help you to schedule a call with my consultant, and prepare for the interview.\n' +
      '• Ok, I will send you an email/WeChat later.\n',
  },
};
const contents_zh = {
  topics: [
    '首次电访',
    '拿简历',
    '电话背调',
    '不看机会',
    '约电话/见面',
    '都可以',
    '竞争对手推荐',
    '安排面试',
  ],
  scripts: {
    首次电访:
      '•\t您好XX, 我是XXX咨询的猎头XX, 专注在XXX领域的猎头（我的同事XX曾经与您沟通过）\n' +
      '•\t请问您还在XX公司，做XX岗位吗？我想了解一下根据您未来的规划，对什么样的机会比较感兴趣？\n' +
      '•\t能简单介绍一下您的背景吗？（了解工作经历及学历背景）\n' +
      '•\t在过去的一年中您主要的工作在哪些方面？\n' +
      '•\t好的，稍后我会把我们正在招聘的一些职位情况发给您\n' +
      '•\t请问您的邮件还是XX@XXXXX.XX吗？\n' +
      '•\t最后还有几个信息与您确认一下（补充缺什么）\n' +
      '•\tXXX也请您把您最新的简历更新一份给我， 我们希望对您有一个更深入的了解以后帮您寻找更适合的岗位。\n' +
      '•\tXXX最近都有哪些机会找过您？\n',
    拿简历:
      '需要注意事项：\n' +
      '1.\t语言简单，直接，不要上来就讲故事\n' +
      '2.\t不要和对方对立\n' +
      '3.\t注意语气和语调\n' +
      '4.\t不要出牌太快，控制节奏\n' +
      '5.\t不要给对方有找理由的机会\n',
    电话背调:
      '•\t与cdd 打好招呼，与背调人电话，表明来意，并且介绍一下自己的工作职能\n' +
      '•\t向背调人进行提问。在这个过程中，有可能人会一下子回答很多内容，而打乱顾问的背调提问顺序，请顾问注意记录信息，不要遗漏\n' +
      '•\t一些敏感问题，对方也许不会直接回答，例如这名cdd 再与您合作的过程中，有过什么样的过失吗？中国人的习惯会避重就轻，我们也许会有怀疑，但是，请尊重对方的回答，尽量做到真实记录。\n' +
      '•\t背调结束是，别忘了说一句：您觉得，目前，我有哪些地方可以帮到您吗？职业发展或者是人才招募方面？\n' +
      '•\t告诉对方，如果对方比较关心该cdd的进程，需要的话， 可以再一段时间后给予信息的更新\n',
    不看机会:
      '•\t没有关系，您也知道我们是专注在XXX 领域的猎头，您会对市场上什么样的信息比较感兴趣？\n' +
      '•\t我还是很好奇您为什么不关注外面的机会？\n' +
      '•\t您如果在目前的公司接下来的主要工作会在哪些方面？\n' +
      '•\t稍后我会把我们正在找品的一些职位情况发给您\n' +
      '•\t请问您的邮件还是XX@XXXXX.XX吗？\n' +
      '•\t您觉得我这个岗位您身边哪位朋友比较合适？（如果介绍了岗位）\n' +
      '•\t最后还有几个信息与您确认一下（补充缺什么）：\n' +
      '•\tXXX也请您把您最新的简历更新一份给我， 我们希望对您有一个更深入的了解以后帮您寻找更适合的岗位\n' +
      '•\t最近都有哪些机会找过您？\n',
    '约电话/见面':
      '•\t您也知道我们是专注在XXX 领域的猎头，我觉得您的背景比较不错，我也希望把您介绍给我们的顾问。\n' +
      '•\t我的顾问是XXX样的背景（了解顾问背景，梳理出selling point），您XX时间方便吗（尽量具体的时间）？我们帮您确认一下他的时间。\n' +
      '•\t我们也不仅仅是希望在一个岗位上与您交流，我们更希望真正的能成为您未来的职业发展提供一些帮助。\n' +
      '•\tXXX也请您把您最新的简历更新一份给我， 我们希望对您有一个更深入的了解以后帮您寻找更适合的岗位\n' +
      '•\t最近都有哪些机会找过您？\n' +
      '•\t不要功力地对待候选人，尊重每一位候选人。\n',
    都可以:
      '•\t我更希望能给您提供一些针对性的岗位。\n' +
      '•\t如果您看机会最关注哪三个方面？为什么？\n' +
      '•\t您最近都看过什么机会？您最满意其中的哪个机会？为什么？\n' +
      '•\tXXX也请您把您最新的简历更新一份给我， 我们希望对您有一个更深入的了解以后帮您寻找更适合的岗位\n' +
      '•\t最近都有哪些机会找过您？\n' +
      '•\t通过提问帮助候选人梳理他的需求。如果背景好请安排顾问面试，帮其一起梳理需求\n',
    竞争对手推荐:
      '•\t您是否有和对方HR沟通过这个岗位？\n' +
      '•\t您如何理解这个岗位？（这个岗位的挑战是什么？）\n' +
      '•\t您会去考虑这个岗位吗？\n' +
      '•\tXXX也请您把您最新的简历更新一份给我， 我们希望对您有一个更深入的了解以后帮您寻找更适合的岗位\n' +
      '•\t最近都有哪些机会找过您？\n',
    安排面试:
      '•\t您好，我是XXX 咨询的XXX。 您方便讲电话吗？\n' +
      '•\t我帮您推荐的XXX公司的XXX岗位，公司觉得您背景比较合适，因此想与您见面沟通一下。\n' +
      '•\t您XX日XX：XX方便吗？\n' +
      '•\t您什么时候方便，我帮您月一个我顾问的电话，与您一起准备一下这次的面试\n' +
      '•\t好的稍后我会发一个邮件/微信给您。\n',
  },
};

class PhoneCallScripts extends React.Component {
  constructor(props) {
    super(props);
    const isZH = i18n.language.match('zh');
    const contents = isZH ? contents_zh : contents_en;
    this.state = {
      selected: contents.topics[0],
      contents,
    };
  }

  render() {
    const { selected, contents } = this.state;
    const { t, classes, onClose } = this.props;

    return (
      <div className={clsx('vertical-layout', classes.root)}>
        <Typography variant="h6">
          {t('common:candidatePhoneCallScripts')}
        </Typography>
        <div>
          <Typography variant="subtitle1" className={classes.subTitle}>
            {t('common:Topic')}
          </Typography>
          <div className={classes.buttonContainer}>
            {contents.topics.map((topic) => (
              <Button
                key={topic}
                size="small"
                className={clsx(classes.button, {
                  [classes.active]: topic === selected,
                })}
                variant={topic === selected ? 'contained' : 'outlined'}
                onClick={() => this.setState({ selected: topic })}
              >
                {t(`common:${topic}`)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            className={classes.subTitle}
            gutterBottom
          >
            Scripts
          </Typography>
          <Scrollbars style={{ height: 240, border: '1px solid gray' }}>
            <div className={classes.scripts}>
              <Typography style={{ fontSize: 12 }}>
                {contents.scripts[selected]}
              </Typography>
            </div>
          </Scrollbars>
        </div>
        <PrimaryButton onClick={onClose}>{t('action:close')}</PrimaryButton>
      </div>
    );
  }
}

export default withStyles(styles)(PhoneCallScripts);
