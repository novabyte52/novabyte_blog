import { useQuasar } from 'quasar';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';

export const usePosts = () => {
  const q = useQuasar();

  const onDraftPost = (msg: string, onOk: () => void) => {
    q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        message: msg,
      },
    }).onOk(async () => {
      onOk();
    });
  };

  const onPublishPost = (msg: string, onOk: () => void) => {
    console.log('publishing post');
    q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        message: 'Do you wish to publish the post? You just started it.',
      },
    }).onOk(async () => {
      onOk();
    });
  };

  const onDiscardPost = (msg: string, onOk: () => void) => {
    q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        message: 'Do you wish to discard what youve written?',
      },
    }).onOk(async () => {
      onOk();
    });
  };

  return {
    onDraftPost,
    onPublishPost,
    onDiscardPost,
  };
};
