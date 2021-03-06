import {findAndClickIt, clickControl, output, backward, getNumberFromSelector, MAX, sibling, clickClose} from '../util';
import {createApp} from '../app';

let app = createApp('买单吧', 'com.bankcomm.maidanba', () => text('首页').exists() && text('我的').exists());
app.add('点击我的', (next) => {
  findAndClickIt(text('我的'));
  clickClose();
  next();
}).add('点击每日签到按钮', (next) => {
  findAndClickIt(idEndsWith('tv_sign'));
  sleep(1000);
  next();
}).add('判断登陆状态', (next) => {
  if (idEndsWith('bt_signin').exists()) {
    next('点击签到按钮');
  } else {
    next();
  }
}).add('判断有没有指纹', (next) => {
  if (!idEndsWith('fpt_dialog_hint_text').exists()) {
    next('输入图案密码');
  } else {
    next();
  }
}).add('点击取消和切换登陆方式', (next) => {
  findAndClickIt(text('取消'));
  findAndClickIt(text('切换登录方式'));
  findAndClickIt(text('手势登录'));
  sleep(500);
  next();
}).add('输入图案密码', (next) => {
  let password = storages.create('password').get('password');
  if (!password) throw new Error('未曾输入过密码');
  let c = idEndsWith('login_gestureLockView_rl').findOne(MAX);
  if (c == null) throw new Error('密码包含块未找到');
  inputPassword(c, password);
  next();
}).add('点击签到按钮', (next) => {
  let signBtn = idEndsWith('bt_signin').findOne(MAX);
  if (signBtn == null) throw new Error();
  clickControl(signBtn);
  sleep(1500);
  // 点击取消？
  let b = idEndsWith('btn_negative').findOnce();
  if (b) clickControl(b);
  next();
}).add('点击抽奖按钮', (next) => {
  let t = className('android.widget.Button').text('去抽奖').findOnce();
  if (t) {
    clickControl(t);
    sleep(1000);
  }
  findAndClickIt(className('android.widget.Button').text('完成'));
  next();
}).add('签到成功', (next) => {
  output('交行签到成功');
  next();
});

/**
 * @param {UiObject} c
 * @param {string} password
 */
function inputPassword(c, password) {
  let rect = c.bounds();
  let points = password.split('').map((number) => getPoint(rect, +number))
  // @ts-ignore
  gesture.apply(null, [password.length * 500].concat(points));
}

/**
 * @param {Rect} rect
 * @param {number} number
 * @returns {[number, number]}
 */
function getPoint(rect, number) {
  let short = Math.min(rect.width(), rect.height())
  let xunit = short / 6;
  let yunit = short / 6;
  let yc = Math.floor((number - 1) / 3);
  let xc = (number - 1) % 3;
  let left = rect.left + ((rect.width() - rect.height()) / 2);
  return [
    left + ((2 * xc) + 1) * xunit,
    rect.top + ((2 * yc) + 1) * yunit
  ]
}

export default app;
