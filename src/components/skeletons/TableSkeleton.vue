<template>
  <q-markup-table class="table-skeleton">
    <thead>
      <tr class="bg-color-primary">
        <th class="text-left" style="width: 150px">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
      </tr>
    </thead>

    <tbody style="width: 100%">
      <tr v-for="n in 5" :key="n">
        <td class="text-left">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="50px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="35px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="65px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="25px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <div
    class="q-table__bottom row items-center justify-end table-skeleton-bottom"
  >
    <q-skeleton animation="blink" type="QBadge" width="250px" />
  </div>
</template>

<style lang="scss">
.table-skeleton {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  tr {
    background-color: white;
  }

  background-color: $primary;
  .q-skeleton--anim {
    background-color: $accent;
  }
}

.table-skeleton-bottom {
  min-width: 100%;
  justify-items: end;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: $primary;

  .q-skeleton--anim {
    background-color: $accent;
  }
}
</style>
