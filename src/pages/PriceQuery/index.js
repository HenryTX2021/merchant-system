import React, { useState } from 'react';
import { Tabs } from 'antd-mobile';
import './style.css';
import '../../styles/common.css';

const PriceQuery = () => {
  const [activeTab, setActiveTab] = useState('bangladesh');
  
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="price-query-container">
      <div className="price-query-header page-header">
        <div className="back-icon" onClick={goBack}>
          <i className="iconfont icon-left"></i>
        </div>
        <h2>报价说明</h2>
        <div className="placeholder"></div>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="孟加拉空运小包" key="bangladesh">
          <div className="price-description">
            <section className="price-section">
              <h3>一、报价名称：</h3>
              <p>孟加拉空运小包</p>
            </section>
            
            <section className="price-section">
              <h3>二、计费说明：</h3>
              <ol>
                <li>进位规则按kg保留两位小数。第二位小数根据第三位小数值四舍五入进位（如：0.011kg以0.01kg计费结算，0.016kg以0.02kg计费结算）。</li>
                <li>按实际重量计费。</li>
                <li>操作费按票结算。</li>
              </ol>
            </section>
            
            <section className="price-section">
              <h3>三、报价表如下表格展示。</h3>
              <div className="price-table-container">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>计费表</th>
                      <th>运费（元/kg）</th>
                      <th>操作费（元/票）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>普货</td>
                      <td>85</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>特殊普</td>
                      <td>100</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>敏货</td>
                      <td>85</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>特殊敏</td>
                      <td>100</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="price-note">
                <p><strong>报价说明</strong></p>
                <p>美妆类（膏粉液油）+眼镜/墨镜，需在以上报价运费维度85+15元/公斤，操作费不变。</p>
              </div>
              
              <div className="price-note">
                <p><strong>报价说明</strong></p>
                <ol>
                  <li>以上报价均为人民币报价，单边不超≦50cm，三边之和≦130cm。</li>
                  <li>报价为ARL广州仓到Daraz express仓报价。</li>
                  <li>其他可能发生的附加费用，如单货不符查验、到ARL仓后的截单退运等，实报实销。</li>
                </ol>
              </div>
            </section>
            
            <section className="price-section">
              <h3>提货/送仓</h3>
              <ol>
                <li>需我司上门提货，请提前告知提货地址、联系人、货量、体积、数量以及提货时间等信息。</li>
                <li>送仓需提前预报。</li>
              </ol>
            </section>
            
            <section className="price-section">
              <h3>时效说明</h3>
              <p>时效为常规时效（如违禁品或单货不符查验不做时效保证）。</p>
            </section>
            
            <section className="price-section">
              <h3>赔付条款</h3>
              <ol>
                <li>货物出现丢货/灭失/损坏/海关查没等情况，赔付2倍运费。</li>
                <li>易碎品请做好内外包装，外箱完好，内件破损，我司不承担赔偿责任。</li>
                <li>如因夹带违禁品，单货不符等情况遭海关没收，长时间扣押等情况，清关方不承担相关责任，且产生惩罚性关税，罚款，及其余经济损失等由发货方承担。</li>
              </ol>
            </section>
            
            <section className="price-section">
              <h3>下单网址：</h3>
              <p><a href="https://www.ar-logistics.com.cn/home" target="_blank" rel="noopener noreferrer">https://www.ar-logistics.com.cn/home</a></p>
            </section>
            
            <section className="price-section">
              <h3>联系方式：</h3>
              <p>邓女士 19925175387</p>
            </section>
            
            <section className="price-section">
              <h3>常见的禁运品类列表</h3>
              <div className="prohibited-items">
                <div className="prohibited-category">
                  <h4>一、枪支（含仿制品、主要零部件）弹药</h4>
                  <ol>
                    <li>枪支（含仿制品、主要零部件）：如手枪、步枪、冲锋枪、防暴枪、气枪、猎枪、运动枪、麻醉注射枪、钢珠枪、催泪枪等。</li>
                    <li>弹药（含仿制品）：如子弹、炸弹、手榴弹、火箭弹、照明弹、燃烧弹、烟幕（雾）弹、信号弹、催泪弹、毒气弹、地雷、手雷、炮弹、火药等。</li>
                  </ol>
                </div>
                
                <div className="prohibited-category">
                  <h4>二、管制器具、攻击性武器</h4>
                  <ol>
                    <li>刀具：如剃须刀、理发剪、菜刀等日常刀具，及匕首、三棱刮刀、带有自锁装置的弹簧刀（跳刀）、其他相类似的单刃、双刃、三棱尖刀、蝴蝶刀、折叠刀、军用刀、武士刀等刀具。</li>
                    <li>其他：如弩、催泪器、催泪枪、电击器、铁莲花、警棍，电棍，伸缩棍，指虎、双截棍等。</li>
                  </ol>
                </div>
                
                <div className="prohibited-category">
                  <h4>三、易燃易爆物品</h4>
                  <ol>
                    <li>爆破器材：如炸药、雷管、导火索、导爆索、爆破剂等。</li>
                    <li>烟花爆竹：如烟花、鞭炮、摔炮、拉炮、砸炮、彩药弹等烟花爆竹及黑火药、烟火药、发令纸、引火线等。</li>
                    <li>易燃固体，如硫磺、蜡烛，乒乓球等禁运</li>
                    <li>易燃液体，如汽油、煤油、油漆、花露水、驱蚊水、杀虫剂、碳酸饮料、酒精、香蕉水、松节油等禁运</li>
                    <li>自燃物品，如黄磷，油纸，油布及其制品等禁运</li>
                    <li>遇水燃烧物品，如金属钠、铝粉等禁运</li>
                    <li>腐蚀性物品，如盐酸、硝酸、双氧水等禁运</li>
                    <li>易爆品，如雷管、炸药、导火索、鞭炮、烟花、打火机、锂电池等禁运</li>
                    <li>其他：如打火石、镁棒、打火机、活性炭、发射药、硝化棉、电点火头等。</li>
                  </ol>
                </div>
              </div>
              
              <div className="prohibited-more">
                <p>更多禁运品类请查看完整列表...</p>
              </div>
            </section>
            
            <div className="price-disclaimer">
              <p>温馨提示：贵司一旦交货，我司则视已阅读并默认以上所有内容!</p>
            </div>
          </div>
        </Tabs.Tab>
        
        <Tabs.Tab title="海外仓服务" key="overseas">
          <div className="price-description">
            <section className="price-section">
              <h3>1、计费重量说明：</h3>
              <p>二销仓储操作费与仓储费、销毁费。</p>
              <p>耗材费根据发运货物所需包装规格、包装类型所使用的耗材，实报实销。</p>
            </section>
            
            <section className="price-section">
              <h3>2、计费表：</h3>
              <div className="price-table-container">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>费用项</th>
                      <th>计费单位</th>
                      <th>费用</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>销毁费</td>
                      <td>Item</td>
                      <td>0.02</td>
                    </tr>
                    <tr>
                      <td>操作费</td>
                      <td>票</td>
                      <td>2.4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section className="price-section">
              <h3>3、仓储费：</h3>
              <div className="price-table-container">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>起始天数</th>
                      <th>结束天数</th>
                      <th>费用</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0</td>
                      <td>15</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td>28</td>
                      <td>0.07</td>
                    </tr>
                    <tr>
                      <td>29</td>
                      <td>58</td>
                      <td>0.1</td>
                    </tr>
                    <tr>
                      <td>59</td>
                      <td>9999</td>
                      <td>0.2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section className="price-section">
              <h3>4、报价说明</h3>
              <div className="price-note">
                <p>以上为海外仓服务的基本报价，具体费用可能根据实际情况有所调整。</p>
              </div>
            </section>
            
            <div className="price-disclaimer">
              <p>温馨提示：贵司一旦交货，我司则视已阅读并默认以上所有内容!</p>
            </div>
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default PriceQuery;