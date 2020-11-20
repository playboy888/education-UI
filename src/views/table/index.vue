/* eslint-disable */
<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="formInline.level" placeholder="用户等级">
            <el-option label="无" value=""></el-option>
            <el-option label="等级一" value="1"></el-option>
            <el-option label="等级二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="formInline.gmtCreate" align="right" type="date" placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
          -
          <el-date-picker v-model="formInline.gmtModified" align="right" type="date" placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
    <el-button type="primary" @click="addEdit()">添加用户</el-button>
    <div class="table-container">
      <el-table :data="list" style="width: 100%;text-algin:center">
        <el-table-column label="用户ID" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- <el-popover trigger="hover" placement="top"> -->
            <!-- <p>姓名: {{ scope.row.name }}</p> -->
            <!-- <p>住址: {{ scope.row.address }}</p> -->
            <div slot="reference" class="name-wrapper">
              {{ scope.row.name }}
            </div>
            <!-- </el-popover> -->
          </template>
        </el-table-column>
        <el-table-column label="角色" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.career }}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.level }}</span>
          </template>
        </el-table-column>
        <el-table-column label="简介" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.intro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="gmt_modified" header-align="center" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ dateFormat(scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination class="block-page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :total="total" :current-page="current" :page-sizes="[3, 6, 9, 12]" :page-size="size"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<style lang="scss">
.el-form--inline {
  width: 98%;
  margin: 0 auto;
}
.table-container {
  margin-top: 30px;
  height: 300px;
  overflow-y: auto;
}
.block {
  width: 100%;
  .block-page {
    margin: 2% 3%;
    float: right;
  }
}
</style>
<script>
import { getList, deleteRow } from "@/api/table";
import moment from "moment";
import store from "@/store/index"
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      // 查询列表
      formInline: {
        name: "",
        level: "",
        gmtCreate: "",
        gmtModified: "",
      },
      list: [],
      listLoading: true,
      //每页显示多少条
      size: 3,
      //当前页
      current: 1,
      //数据总条数
      total: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 条件查询
    onSubmit() {
      //当前页
      (this.current = 1), this.fetchData();
    },
    //格式话日期
    dateFormat: function ({ row, column }) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    fetchData() {
      this.listLoading = true;
      getList({
        size: this.size,
        current: this.current,
        ...this.formInline,
      }).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.fetchData();
    },
    // 用户编辑当前行
    handleEdit(index, row) {
      this.$store.state.user.upDateList=row
      this.$router.replace("/example/tree?update=true");
    },
    addEdit() {
      this.$router.replace("/example/tree?update=false");
    },
    //用户删除当前行
    handleDelete(index, row) {
      const id = row.id + "";
      deleteRow({ id: id }).then((response) => {
        console.log(response);
      });
    },
  },
};
</script>
