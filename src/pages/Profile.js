import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Avatar,
  Upload,
  Form,
  Input,
  message,
  Modal,
} from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import BgProfile from "../assets/images/bg-profile.jpg";
import Cookies from "js-cookie";
import axios from "axios";
import Password from "antd/es/input/Password";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: false,
      loading: false,
      isModalVisible: false,
      fileList2: [],
      previewVisible2: false,
      imgBBLink2: "",
    };
    this.formRef = React.createRef();

  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleFileChange = async ({ fileList }, uploaderNumber) => {
    try {
      this.setState({ [`fileList${uploaderNumber}`]: fileList, fileList: [] }); // Clear the general fileList

      if (fileList.length > 0) {
        const imgFile = fileList[0].originFileObj;

        if (imgFile) {
          const formData = new FormData();
          formData.append('image', imgFile);

          const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              key: 'a94bb5679f1add2d50baee0220cc7926', // Replace with your ImgBB API key
            },
          });

          const imgBBLinkKey = `imgBBLink${uploaderNumber}`;
          this.setState({ [imgBBLinkKey]: response.data.data.url });
          console.log('Image uploaded to ImgBB:', response.data.data.url);

          console.log('this.state', this.state);
        }
      }
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error in handleFileChange:', error);

      // Handle specific errors if needed
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('ImgBB API Error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from ImgBB API');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in request setup:', error.message);
      }
    }
  };

  handleSubmit = async (values) => {
    try {
      const { PASSWORD, OLD_PASSWORD } = values;
      if(PASSWORD !== "") {
        if (PASSWORD.length < 8) {
          message.error("Password should be at least 8 characters");
          return;
        }
      }
      let rememberedUser = Cookies.get('rememberedUser');
      let USER_ID = null;
        let NAME1 = "";
        let PHOTO1 = "https://i.ibb.co/YySdxGJ/user-1.png";

      if (rememberedUser) {
        rememberedUser = JSON.parse(rememberedUser);
        USER_ID = rememberedUser.USER_ID;
        NAME1 = rememberedUser.NAME;
        PHOTO1 = rememberedUser.PHOTO;
      }

      // Check if the user entered the old password correctly
      const response = await axios.post("http://35.154.1.99:3001/checkPassword", {
        USER_ID: USER_ID,
        PASSWORD: OLD_PASSWORD,
      });

      if (response.data.match) {
        console.log("Old password is correct");

        const updatedValues = {
          PHOTO: this.state.imgBBLink2 === "" ? PHOTO1 : this.state.imgBBLink2,
          USER_ID: USER_ID,
          NAME: values.NAME === "" ? NAME1 : values.NAME,
          PASSWORD: PASSWORD === "" ? OLD_PASSWORD : PASSWORD,
        };
        console.log("Updated values:", updatedValues);

        const response = await axios.post(
            "http://35.154.1.99:3001/updateProfile",
            updatedValues
        );
        if (response.data.success) {
          message.success("Profile updated successfully");
          Cookies.remove ('rememberedUser');
          window.location.href = '/';
        } else {
          message.error("Failed to update customer");
        }
      } else {
        message.error("Old password is incorrect");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      message.error("Internal server error");
    }
  };

  render() {
    const { form, isModalVisible, fileList2, previewVisible2, imgBBLink2 } =
        this.state;

    let rememberedUser = Cookies.get('rememberedUser');
    let NAME1 = "";
    let PHOTO1 = "https://i.ibb.co/YySdxGJ/user-1.png";
    let EMAIL1 = "";
    let ROLE1 = "USER";

    if (rememberedUser) {
      rememberedUser = JSON.parse(rememberedUser);
      NAME1 = rememberedUser.NAME;
      PHOTO1 = rememberedUser.PHOTO;
        EMAIL1 = rememberedUser.EMAIL;
        ROLE1 = rememberedUser.ROLE;
    }

    const fileLimit = {
      accept: 'image/*', // Accept only image files
    };

    return (
        <>
          <div
              className="profile-nav-bg"
              style={{ backgroundImage: "url(" + BgProfile + ")" }}
          ></div>

          <Card
              className="card-profile-head"
              bodyStyle={{ display: "none" }}
              title={
                <Row justify="space-between" align="middle" gutter={[24, 0]}>
                  <Col span={24} md={12} className="col-info">
                    <Avatar.Group>
                      <Avatar
                          size={74}
                          shape="square"
                          src={PHOTO1}
                          style={{
                            marginTop: 20,
                            marginBottom: 20,
                            cursor: "pointer",
                          }}
                          onClick={this.showModal}
                      />

                      <div className="avatar-info">
                        <h4 className="font-semibold m-0">{NAME1}</h4>
                        <p>{ROLE1}</p>
                      </div>
                    </Avatar.Group>
                  </Col>

                  {/* Modal for enlarged image */}
                  <Modal
                      visible={isModalVisible}
                      onCancel={this.handleCancel}
                      footer={null}
                      centered
                  >
                    <img
                        src={PHOTO1}
                        alt="Enlarged"
                        style={{ width: "100%" }}
                    />
                  </Modal>
                </Row>
              }
          ></Card>

          <Row gutter={[16, 16]} justify="left" align="top">
            <Col span={24} md={24} className="mb-24">
              <Card
                  bordered={false}
                  className="header-solid h-full card-profile-information"
              >
                <Descriptions>
                  <Descriptions.Item label="Name" span={3}>
                    {NAME1}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" span={3}>
                    {EMAIL1}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location" span={3}>
                    Sri Lanka
                  </Descriptions.Item>
                  {/*<Descriptions.Item label="Social" span={3}>*/}
                  {/*  <a href="#" className="mx-5 px-5">*/}
                  {/*    {<TwitterOutlined />}*/}
                  {/*  </a>*/}
                  {/*  <a href="#" className="mx-5 px-5">*/}
                  {/*    {<FacebookOutlined style={{ color: "#344e86" }} />}*/}
                  {/*  </a>*/}
                  {/*  <a href="#" className="mx-5 px-5">*/}
                  {/*    {<InstagramOutlined style={{ color: "#e1306c" }} />}*/}
                  {/*  </a>*/}
                  {/*</Descriptions.Item>*/}
                </Descriptions>
              </Card>
            </Col>
            <Col span={24} md={24} className="mb-24">
              <Card
                  bordered={false}
                  className="header-solid h-full card-profile-information"
                  title="Change Profile Details"
              >
                <Form form={form} layout="vertical" onFinish={this.handleSubmit}>
                  <Row gutter={[16, 16]} justify="left" align="top">
                    <Col span={21}>
                      <Form.Item name="NAME" label="Name">
                        <Input placeholder="Enter Name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={3}>
                      {/* File Upload */}
                      <Form.Item
                          name="PHOTO"
                          label="Upload Photo"
                      >
                        <Upload
                            customRequest={({ onSuccess, onError, file }) => {
                              onSuccess();
                            }}
                            fileList={fileList2}
                            onChange={(info) => this.handleFileChange(info, 2)}
                            {...fileLimit}
                            listType="picture-card"
                            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                            maxCount={1} // Allow only one file
                            onPreview={() => this.setState({ previewVisible2: true })}
                        >
                          {fileList2.length >= 1 ? null : (
                              <div>
                                <UploadOutlined  />
                                <div className="ant-upload-text">Upload</div>
                              </div>
                          )}
                        </Upload>
                        {/* Display uploaded image */}
                        <div className="clearfix">
                          <Modal
                              visible={this.state.previewVisible2}
                              footer={null}
                              onCancel={() => this.setState({ previewVisible2: false })}
                          >
                            {this.state.imgBBLink2 === '' ? (
                                <div className="loading-indicator">Uploading...</div>
                            ) : (
                                <img
                                    alt="Preview"
                                    style={{ width: '100%' }}
                                    src={this.state.imgBBLink2}
                                    onError={(e) => {
                                      console.error('Image loading error:', e);
                                    }}
                                />
                            )}
                          </Modal>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <Form.Item name="PASSWORD" label="New Password">
                        <Password placeholder="Enter New Password" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <Form.Item
                          name="OLD_PASSWORD"
                          label="Old Password"
                          rules={[
                            { required: true, message: "Please Enter Old Password" },
                          ]}
                      >
                        <Password placeholder="Enter Old Password" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Update Customer
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </>
    );
  }
}

export default Profile;
