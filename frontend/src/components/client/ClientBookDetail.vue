<template>
  <div>
    <hr />
    <div class="p-1">
      <strong>Tên sách:</strong>
      {{ book.name }}
    </div>
    <div class="p-1">
      <strong>Giá: </strong>
      {{ book.price }}
    </div>
    <div class="p-1">
      <strong>Số lượng: </strong>
      {{ book.quantity }}
    </div>
    <div class="p-1">
      <strong>Số lượng sách còn lại: </strong>
      {{ remainingBooks }}
    </div>
    <div class="p-1">
      <strong>Tác giả:</strong>
      {{ book.author }}
    </div>
    <hr />
    <div class="p-1">
      <strong>Tên nhà xuất bản:</strong>
      {{ book.publisher }}
    </div>
    <div class="p-1">
      <strong>Năm xuất bản:</strong>
      {{ book.publishYear }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ NXB:</strong>
      {{ book.publisherAddress }}
    </div>

  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ReaderService from "@/services/client/reader.service";

export default {
  props: {
    book: { type: Object, required: true },
  },
  data() {
    return {
      formData: {
        quantity: 1,
        borrowDate: "",
        returnDate: "",
        book_id: this.book._id,
      },
      remainingBooks: 0,
    };
  },
  methods: {
    async remainingbooks() {
      try {
        const response = await ReaderService.getNumberBorrowed(this.book._id);
        this.remainingBooks = this.book.quantity - response;
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },
  },
  watch: {
    book: {
      handler() {
        this.remainingbooks();
      },
      deep: true,
    },
  },
  mounted() {
    this.remainingbooks();
  },
};
</script>