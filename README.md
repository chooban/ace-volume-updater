# Ace Volume Updater

Single endpoint webhook which listens for push notifications from github in the `ace-data-container` project. On
receiving a notification, it downloads a zip of the project and uncompresses it into the directory that's being used as
a data volume.

## Secrets

The hook requires access to a single secret: the value that github uses to sign the messages.
