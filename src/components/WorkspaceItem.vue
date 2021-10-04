<template>
  <li>
    <!-- depth가 깊어질수록 documents 타이틀의 왼쪽 여백을 계속 증가시키기(14px * depth) -->
    <div
      :style="{ paddingLeft: `${14 * depth}px`}"
      :class="{ active: parseInt($route.params.id, 10) === workspace.id }"
      class="title"
      @click="$router.push({
        name: 'Workspace', 
        params: {
          id: workspace.id
        }
      })">
      <span
        :class="{active: showChildren}"
        class="material-icons"
        @click.stop="showChildren = !showChildren">
        play_arrow
      </span>
      <span class="text">
        {{ workspace.title || '제목 없음' }}
      </span>
      <div class="actions">
        <span
          class="material-icons"
          @click.stop="createWorkspace">
          add
        </span>
        <span
          class="material-icons"
          @click.stop="deleteWorkspace">
          delete
        </span>
      </div>
    </div>
    <!-- 컴포넌트 내부에서 자기 자신을 호출하는 것이 가능(재귀 호출) -->
    <!-- 하위 documents가 있고 showChildren이 true일 때만 출력 -->
    <div
      v-if="!hasChildren && showChildren" 
      :style="{ paddingLeft: `${14 * depth + 22}px`}"
      class="no-children">
      하위 페이지가 없습니다.
    </div>
    <ul
      v-if="hasChildren
        &&
        showChildren">
      <WorkspaceItem
        v-for="ws in workspace.documents"
        :key="ws.id"
        :workspace="ws"
        :depth="depth + 1" />
    </ul>
  </li>
</template>

<script>
export default {
    props : {
        workspace : {
            type : Object,
            default : () => ({})
        },
        // 재귀 호출될 때마다 depth 데이터를 1씩 증가시키기
        depth : {
            type : Number,
            default : 1
        }
    },
    data(){
        return {
            // 하위 documents를 보여줄건지 말지 
            showChildren : false
        }
    },
    computed : {
        // 자식 documents가 없는 경우 ul 태그가 출력되지 않도록 계산된 데이터를 만들어줌 
        hasChildren(){
            return this.workspace.documents && this.workspace.documents.length
        }
    },
    // 경로를 확인해서 새로고침해도 그 이전에 있던 경로로 토글 버튼 유지
    created(){
      this.showChildren = this.$store.state.workspace.currentWorkspacePath.some(
        workspace => workspace.id === this.workspace.id
      )
    },
    methods : {
      async createWorkspace(){
        // document 생성 시 현재 document의 id를 함께 전달해서 하위 document로 생성되도록 함
        await this.$store.dispatch('workspace/createWorkspace', {
          parentId : this.workspace.id
        })
        // 하위 document가 생성이 완료된 후에(async, await) 자동으로 열리도록 실행
        this.showChildren = true
      },
      deleteWorkspace(){
        this.$store.dispatch('workspace/deleteWorkspace', {
          id : this.workspace.id
        })
      }
    }
}
</script>

<style lang="scss" scoped>
li {
    .title{
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 14px;
        color: rgba($color-font, .7);
        &:hover {
            background-color: $color-background--hover1;
            padding-right: 4px;
            .actions{
                display: flex;
            }
        }
        &.active {
          .text {
            font-weight: 700;
            color: rgba($color-font, .8);
          }
        }
        .material-icons {
            font-size: 18px;
            color: $color-icon;
            margin-right: 4px;
            &:hover{
                background-color: $color-background--hover2;
            }
            &.active{
                transform: rotate(90deg);
            }
        }
        .text{
            flex-grow: 1;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .actions{
            display: none;
            align-items: center;
        }
    }
    .no-children{
      color: rgba($color-font, .35);
      height: 30px;
      display: flex;
      align-items: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
}
    
</style>