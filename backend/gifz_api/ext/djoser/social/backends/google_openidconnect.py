from social_core.backends.google_openidconnect import \
    GoogleOpenIdConnect as GoogleOpenIdConnectOriginal


class GoogleOpenIdConnect(GoogleOpenIdConnectOriginal):
    STATE_PARAMETER = False

    def get_and_store_nonce(self, url, state):
        state = state or 'test'
        super().get_and_store_nonce(url, state)
