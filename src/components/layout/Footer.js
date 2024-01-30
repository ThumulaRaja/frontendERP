
import { Layout, Row, Col } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2024 Nihal Gems Management System. All Rights Reserved. Copyright by Beego.
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
