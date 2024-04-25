<template>
  <table class="table">
            <thead>
                <br>
                <tr>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Author</th>
                    <th>Thumbnail</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in books" :key="book._id" :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
                    <td>{{ book.bookTitle }}</td>
                    <td>{{ book.price }}</td>
                    <td>{{ book.author }}</td>
                    <td>
                        <img :src="'http://localhost:3000/uploads/' + book.thumbnail" alt="Book Thumbnail" width="150" height="150">
                    </td>
                    <td>
                      <a-tooltip title="Mượn ngay">
                        <router-link :to="{
                          name: 'borrow-book',
                          params: { id: book._id },
                          }"
                        >
                          <a-button class="btn btn-primary">
                            <solution-outlined />
                            Mượn sách
                          </a-button>
                        </router-link>
                      </a-tooltip>
                    </td>
                </tr>
            </tbody>
        </table>
  <!-- <ul class="list-group">
    <li class="list-group-item" v-for="(book, index) in books" :key="book._id"
      :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
      <img :src="book.thumbnail" class="q-mt-sm" fit="contain" style="max-width: 170px; height: 200px;">
      {{ book.bookTitle }}
      <img :src="'http://localhost:3000/uploads/' + book.thumbnail" alt="Book Thumbnail" width="150" height="150">
    </li>
  </ul> -->
</template>

<script>
// import BookCard from '@/client/BookCard.vue';

export default {
  props: {
    books: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
    // borrowBook(id){
    //   console.log(id);
    // }
  }
};
</script>

<style>
 button
 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    margin-right: 1rem;
  }
</style>