<template>
  <div class="info-container">
    <div style="margin: 20px;"></div>
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
      <el-form-item v-if="isShow" label="用户ID">
        <el-input disabled v-model="formLabelAlign.id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload class="avatar-uploader" action="http://127.0.0.1:8888/user/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="formLabelAlign.avatar" :src="formLabelAlign.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-input v-model="formLabelAlign.career"></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="formLabelAlign.level"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="formLabelAlign.intro"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{btnText}}</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss">
.info-container {
  width: 50%;
  margin: 4% auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import { insertUser, updateUser } from "@/api/table";
export default {
  data() {
    return {
      isShow: false,
      btnText: "添加",
      formLabelAlign: {
        id: "",
        name: "",
        career: "",
        level: "",
        intro: "",
        avatar: ''
      },
    };
  },
  created() {
    // 编辑页面
    if (this.$route.query.update=="true") {
      const upDateList = this.$store.state.user.upDateList;
      if (!upDateList) {
        this.$router.replace("/example/tree?update=false");
        return;
      }
      this.isShow = true;
      this.btnText = "保存";
      this.formLabelAlign = upDateList;
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return  isLt2M;
      },
    //添加和保存用户
    onSubmit() {
      if (this.isShow) {
        updateUser(this.formLabelAlign).then((res) => {
          if (res.code === 20000) {
            this.$router.replace("/example/table");
          }
        });
      }
      // 添加用户
      else {
        insertUser(this.formLabelAlign).then((res) => {
          if (res.code === 20000) {
            this.$router.replace("/example/table");
          }
        });
      }
    },
  },
};
</script>