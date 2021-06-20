import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Progress, Button } from 'antd';

// 声明组件  并对外输出
class Notfound extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      // activeTab: 'pop' ,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="developing notfound">
        <Progress
          type="circle"
          percent={100}
          format={() => '404'}
          width={200}
          status="active"
        />

        <div className="link ptbig">
          <p className="mbbig">
            <Link to="/">{t('tohome')}</Link>
          </p>
          <p className="mbbig">
            <Link to="/login">{t('tologin')}</Link>
          </p>
          <Button type="primary" onClick={() => hashHistory.goBack()}>
            {t('back')}
          </Button>
        </div>
      </div>
    );
  }
}
export default withTranslation('notfound')(Notfound);
