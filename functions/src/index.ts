import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript



export const subscribeToTopic = functions.https.onCall(
  async (data, context) => {
      await admin.messaging().subscribeToTopic(data.token, data.topic);
      return `subscribed to ${data.topic}`;

  }
);


export const unsubscribeFromTopic = functions.https.onCall(
  async (data, context) => {
      await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
      return `unsubscribed to ${data.topic}`;

  }
);

export const sendOnFireStoreCreate = functions.firestore
.document('board/discover')
.onCreate(async snapshot => {
  const martplace = snapshot.data();
  const notification: admin.messaging.Notification = {
      title: 'Check out my marketplace',
      body: martplace.headline

      
  };

  const payload: admin.messaging.Message = {
      notification,
      webpush: {
          notification: {
              vibrate: [200, 100, 200],
              icon: 'https://pbs.twimg.com/profile_images/1145846208117653505/Czmgqh7u.png',
              actions: [
                  {
                      action: 'like',
                      title: 'Lets do it'
                  },
                  {
                      action: 'Dislike',
                      title: 'fuck it bro'
                  },
              ]
          }
      },

      topic: 'marketplace'
  };

  return admin.messaging().send(payload);
});

