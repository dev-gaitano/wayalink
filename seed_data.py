from database_connection import db_connection


def seed_data():
    connection = db_connection()
    cursor = connection.cursor()

    # --- LOCATIONS ---
    cursor.execute(
        """
        INSERT INTO locations (id, name, type, latitude, longitude, region, created_at) VALUES
        ('bc2a9703-6732-4019-be86-8f5b24f917b2', 'Kikuyu Textiles Ltd', 'manufacturer', -1.2495000, 36.6673000, 'Kiambu', '2025-11-10 07:22:31.582901'),
        ('fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'Nairobi Central Warehouse', 'warehouse', -1.2863890, 36.8172230, 'Nairobi', '2025-11-10 07:22:31.582901'),
        ('ae1c05d9-5101-457f-8d8d-87545ee03030', 'Nakuru Storage Depot', 'warehouse', -0.3030990, 36.0800250, 'Nakuru', '2025-11-10 07:22:31.582901'),
        ('a1c05d4c-9329-457c-890a-8ae082b66315', 'Eldoret Retail Hub', 'retailer', 0.5203600, 35.2697800, 'Uasin Gishu', '2025-11-10 07:22:31.582901'),
        ('d0aefc0a-fdd5-492b-837b-576ed7e460c2', 'Kisumu Market Outlet', 'retailer', -0.0917020, 34.7679560, 'Kisumu', '2025-11-10 07:22:31.582901'),
        ('f171be8a-b459-4771-a0df-4c539ed754bc', 'Custom Delivery Point A', 'custom', -1.3150000, 36.7900000, 'Nairobi South', '2025-11-10 07:22:31.582901'),
        ('c123f7d4-0d16-4666-aca2-116e5d0da486', 'Custom Pickup Point B', 'custom', -0.4200000, 36.9500000, 'Naivasha', '2025-11-10 07:22:31.582901');
    """
    )

    # --- USERS ---
    cursor.execute(
        """
        INSERT INTO users (id, phone_number, id_number, name, title, location_id, created_at) VALUES
        ('a1b23d48-f111-4d5f-a8b7-c84f8ef1a2b3', '+254712345678', '12345678', 'John Kamau', 'admin', 'bc2a9703-6732-4019-be86-8f5b24f917b2', '2025-11-10 07:32:17.65274'),
        ('b2c34d56-f222-4d5f-a8b7-c84f8ef1a2b3', '+254723456789', '23456789', 'Mary Wanjiku', 'field', 'bc2a9703-6732-4019-be86-8f5b24f917b2', '2025-11-10 07:32:17.65274'),
        ('c3d45e6f-f333-4d5f-a8b7-c84f8ef1a2b3', '+254734567890', '34567890', 'Peter Omondi', 'field', 'bc2a9703-6732-4019-be86-8f5b24f917b2', '2025-11-10 07:32:17.65274'),
        ('d4e56fa7-4444-4d5f-a8b7-c84f8ef1a2b3', '+254745678901', '45678901', 'Grace Akinyi', 'field', 'bc2a9703-6732-4019-be86-8f5b24f917b2', '2025-11-10 07:32:17.65274'),
        ('e5f67e0a-f555-4d5f-a8b7-c84f8ef1a2b3', '+254756789012', '56789012', 'David Mwangi', 'admin', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', '2025-11-10 07:32:20.05169'),
        ('f6a78e0b-6666-4d5f-a8b7-c84f8ef1a2b3', '+254767890123', '67890123', 'Jane Njeri', 'field', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', '2025-11-10 07:32:20.05169'),
        ('a7b04e10-7777-4d5f-a8b7-c84f8ef1a2b3', '+254778901234', '78901234', 'James Otieno', 'field', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', '2025-11-10 07:32:20.05169'),
        ('b8c09d18-8888-4d5f-a8b7-c84f8ef1a2b3', '+254789012345', '89012345', 'Lucy Wambui', 'field', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', '2025-11-10 07:32:20.05169'),
        ('c9d0e1f2-9999-4d5f-a8b7-c84f8ef1a2b3', '+254790123456', '90123456', 'Samuel Kipchoge', 'admin', 'ae1c05d9-5101-457f-8d8d-87545ee03030', '2025-11-10 07:32:23.509572'),
        ('d0e1e22a-aaaa-4d5f-a8b7-c84f8ef1a2b3', '+254701234567', '12345677', 'Alice Cherotoo', 'field', 'ae1c05d9-5101-457f-8d8d-87545ee03030', '2025-11-10 07:32:23.509572'),
        ('e1f23b40-bbbb-4d5f-a8b7-c84f8ef1a2b3', '+254711234568', '11234568', 'Robert Mutua', 'field', 'ae1c05d9-5101-457f-8d8d-87545ee03030', '2025-11-10 07:32:23.509572'),
        ('f2a3b4c5-cccc-4d5f-a8b7-c84f8ef1a2b3', '+254712345669', '21234569', 'Michael Kibet', 'admin', 'a1c05d4c-9329-457c-890a-8ae082b66315', '2025-11-10 07:32:26.220126'),
        ('a3b4c5d6-dddd-4d5f-a8b7-c84f8ef1a2b3', '+254713345670', '31234570', 'Sarah Chepkemoi', 'field', 'a1c05d4c-9329-457c-890a-8ae082b66315', '2025-11-10 07:32:26.220126'),
        ('b4c5d6e7-eeee-4d5f-a8b7-c84f8ef1a2b3', '+254714345671', '41234571', 'Daniel Koech', 'field', 'a1c05d4c-9329-457c-890a-8ae082b66315', '2025-11-10 07:32:26.220126'),
        ('c5d6e7f8-ffff-4d5f-a8b7-c84f8ef1a2b3', '+254715345672', '51234572', 'Nancy Jeptoo', 'field', 'a1c05d4c-9329-457c-890a-8ae082b66315', '2025-11-10 07:32:26.220126'),
        ('d6e7f8f0-0000-4d5f-a8b7-c84f8ef1a2b3', '+254716234573', '61234573', 'George Odhiambo', 'admin', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', '2025-11-10 07:32:29.785503'),
        ('e7f8f900-1111-4d5f-a8b7-c84f8ef1a2b3', '+254717345674', '71234574', 'Catherine Adhiamb', 'field', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', '2025-11-10 07:32:29.785503'),
        ('f8a0b0b1-2222-4d5f-a8b7-c84f8ef1a2b3', '+254718345675', '81234575', 'Victor Onyango', 'field', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', '2025-11-10 07:32:29.785503'),
        ('a90b1c20-3333-4d5f-a8b7-c84f8ef1a2b3', '+254719234576', '91234576', 'Patrick Kimum', 'field', 'f171be8a-b459-4771-a0df-4c539ed754bc', '2025-11-10 07:32:33.830474'),
        ('b0c1d2e3-4444-4d5f-a8b7-c84f8ef1a2b3', '+254702345678', '23456781', 'Rose Nyambura', 'field', 'f171be8a-b459-4771-a0df-4c539ed754bc', '2025-11-10 07:32:33.830474'),
        ('c1d2e3f4-5555-4d5f-a8b7-c84f8ef1a2b3', '+254720345679', '12345679', 'Simon Kariuki', 'admin', 'f171be8a-b459-4771-a0df-4c539ed754bc', '2025-11-10 07:32:33.830474'),
        ('d2e3f4a5-6666-4d5f-a8b7-c84f8ef1a2b3', '+254721345680', '22345680', 'Elizabeth Wangari', 'field', 'f171be8a-b459-4771-a0df-4c539ed754bc', '2025-11-10 07:32:33.830474'),
        ('e3f4a5b6-7777-4d5f-a8b7-c84f8ef1a2b3', '+254732345681', '32345681', 'Francis Njooge', 'field', 'c123f7d4-0d16-4666-aca2-116e5d0da486', '2025-11-10 07:32:36.203873'),
        ('f4a5b6c7-8888-4d5f-a8b7-c84f8ef1a2b3', '+254742345682', '42345682', 'Margaret Wairimi', 'admin', 'c123f7d4-0d16-4666-aca2-116e5d0da486', '2025-11-10 07:32:36.203873'),
        ('a5b6c7d8-9999-4d5f-a8b7-c84f8ef1a2b3', '+254752345683', '52345683', 'Anthony Gitau', 'field', 'c123f7d4-0d16-4666-aca2-116e5d0da486', '2025-11-10 07:32:36.203873'),
        ('b6c7d8e9-aaaa-4d5f-a8b7-c84f8ef1a2b3', '+254762345234', '42009019', 'Eugene Gatamo', 'admin', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', '2025-11-10 07:37:51.877312');
    """
    )

    # --- SHIPMENTS ---
    cursor.execute(
        """
        INSERT INTO shipments (id, tracking_code, origin_id, destination_id, status, created_at, last_update) VALUES
        ('11111111-1111-1111-1111-111111111111', 'WL-2025-001', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'delivered', '2025-11-01 08:30:00', '2025-11-02 14:20:00'),
        ('22222222-2222-2222-2222-222222222222', 'WL-2025-002', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'ae1c05d9-5101-457f-8d8d-87545ee03030', 'delivered', '2025-11-02 09:15:00', '2025-11-03 16:45:00'),
        ('33333333-3333-3333-3333-333333333333', 'WL-2025-003', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'in_transit', '2025-11-03 07:00:00', '2025-11-03 10:30:00'),
        ('44444444-4444-4444-4444-444444444444', 'WL-2025-004', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'in_transit', '2025-11-01 11:20:00', '2025-11-01 06:15:00'),
        ('55555555-5555-5555-5555-555555555555', 'WL-2025-005', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'delivered', '2025-11-03 10:00:00', '2025-11-04 15:30:00'),
        ('66666666-6666-6666-6666-666666666666', 'WL-2025-006', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'delivered', '2025-11-04 08:45:00', '2025-11-05 17:20:00'),
        ('77777777-7777-7777-7777-777777777777', 'WL-2025-007', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'f171be8a-b459-4771-a0df-4c539ed754bc', 'in_transit', '2025-11-09 13:30:00', '2025-11-10 05:45:00'),
        ('88888888-8888-8888-8888-888888888888', 'WL-2025-008', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'c123f7d4-0d16-4666-aca2-116e5d0da486', 'pending', '2025-11-10 07:00:00', '2025-11-10 07:00:00'),
        ('99999999-9999-9999-9999-999999999999', 'WL-2025-009', 'ae1c05d9-5101-457f-8d8d-87545ee03030', 'c123f7d4-0d16-4666-aca2-116e5d0da486', 'delivered', '2025-11-05 09:00:00', '2025-11-05 18:30:00'),
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'WL-2025-010', 'ae1c05d9-5101-457f-8d8d-87545ee03030', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'in_transit', '2025-11-09 14:20:00', '2025-11-10 04:30:00'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'WL-2025-011', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'f171be8a-b459-4771-a0df-4c539ed754bc', 'delivered', '2025-11-06 10:30:00', '2025-11-07 12:15:00'),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'WL-2025-012', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'c123f7d4-0d16-4666-aca2-116e5d0da486', 'delivered', '2025-11-07 11:00:00', '2025-11-08 09:45:00'),
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'WL-2025-013', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'c123f7d4-0d16-4666-aca2-116e5d0da486', 'in_transit', '2025-11-10 15:00:00', '2025-11-10 03:20:00'),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'WL-2025-014', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'c123f7d4-0d16-4666-aca2-116e5d0da486', 'pending', '2025-11-10 06:30:00', '2025-11-10 06:30:00'),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'WL-2025-015', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'f171be8a-b459-4771-a0df-4c539ed754bc', 'lost', '2025-10-28 08:00:00', '2025-11-05 10:00:00'),
        ('00000000-0000-0000-0000-000000000001', 'WL-2025-016', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'lost', '2025-10-30 09:30:00', '2025-11-06 14:20:00'),
        ('00000000-0000-0000-0000-000000000002', 'WL-2025-017', 'bc2a9703-6732-4019-be86-8f5b24f917b2', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'pending', '2025-11-10 05:00:00', '2025-11-10 05:00:00'),
        ('00000000-0000-0000-0000-000000000003', 'WL-2025-018', 'ae1c05d9-5101-457f-8d8d-87545ee03030', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'pending', '2025-11-10 06:00:00', '2025-11-10 06:00:00'),
        ('00000000-0000-0000-0000-000000000004', 'WL-2025-019', 'fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d', 'd0aefc0a-fdd5-492b-837b-576ed7e460c2', 'pending', '2025-11-10 07:15:00', '2025-11-10 07:15:00'),
        ('00000000-0000-0000-0000-000000000005', 'WL-2025-020', 'a1c05d4c-9329-457c-890a-8ae082b66315', 'f171be8a-b459-4771-a0df-4c539ed754bc', 'pending', '2025-11-10 07:30:00', '2025-11-10 07:30:00');
    """
    )

    connection.commit()
    cursor.close()
    connection.close()
    print("Database seeded successfully.")


if __name__ == "__main__":
    seed_data()
