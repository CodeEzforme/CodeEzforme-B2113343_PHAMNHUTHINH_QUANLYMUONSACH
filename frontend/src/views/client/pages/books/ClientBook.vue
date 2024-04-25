<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3">
      <div class="page row">
        <div class="col-md-10">
          <ClientInputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-8">
          <div class="">
            <button
              class="btn btn-sm btn-primary custom-margin mb-3"
              @click="refreshList()"
            >
              <i class="fas fa-redo"></i> Làm mới
            </button>
          </div>

          <ClientBookList
            v-if="filteredBooksCount > 0"
            :books="filteredBooks"
            v-model:activeIndex='activeIndex'
          />
          <p v-else>Không có liên hệ nào.</p>
        </div>

        <div class="mt-3 col-4">
          <div v-if="activeBook">
            <h4>
              Chi tiết đầu sách
              <i class="fa-solid fa-book"></i>
            </h4>
            <ClientBookDetail :book="activeBook" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClientBookDetail from "@/components/client/ClientBookDetail.vue";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ClientInputSearch from "@/components/client/ClientInputSearch.vue";
import ClientBookList from "@/components/client/ClientBookList.vue";
import BookService from "@/services/client/book.service";

export default {
  components: {
    ClientBookDetail,
    ClientInputSearch,
    ClientBookList,
    ClientAppHeader,
  },
  // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    // Chuyển các đối tượng book thành chuỗi để tiện cho tìm kiếm.
    booksStrings() {
      return this.books.map((book) => {
        const {
          id_publisher,
          bookTitle,
          price,
          quantity,
          publishYear,
          author,
          thumbnail,
        } = book;
        return [
          id_publisher,
          bookTitle,
          price,
          quantity,
          publishYear,
          author,
          thumbnail,
        ].join("");
      });
    },
    // Trả về các book có chứa thông tin cần tìm kiếm.
    filteredBooks() {
      if (!this.searchText) return this.books;

      return this.books.filter((_book, index) =>
        this.booksStrings[index].includes(this.searchText)
      );
    },
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveBooks();
      this.searchText = "";
      this.activeIndex = -1;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
}

.custom-margin {
  margin-right: 10px; /* hoặc bất kỳ giá trị nào bạn muốn */
}
</style>
