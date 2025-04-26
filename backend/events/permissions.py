from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Niestandardowe uprawnienie zezwalające tylko właścicielom obiektu na jego edycję.
    Odczyt jest dozwolony dla wszystkich (nawet niezalogowanych, jeśli widok na to pozwala).
    """

    def has_object_permission(self, request, view, obj):
        # Uprawnienia do odczytu są dozwolone dla każdego żądania,
        # więc zawsze zezwalamy na żądania GET, HEAD lub OPTIONS.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Uprawnienia do zapisu są dozwolone tylko dla właściciela wydarzenia.
        # Zakładamy, że model ma pole 'user'.
        return obj.user == request.user
