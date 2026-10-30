"""Rebuild clinical Scene 11 to follow the real i-FIX Duo IFU:
cement is dispensed from the AUTOMIX tip directly INTO the crown intaglio (extra-oral),
then the loaded crown is flipped and carried over the clean prep (hand-off to Scene 12).
Scene 12: prep is clean (no cement coat) - the excess flash comes out of the loaded crown on seating.
"""
import bpy, bmesh, math, sys
from mathutils import Vector, Matrix, Quaternion

OUT_BLEND = r"C:\Users\PC\Desktop\i-FIX_Duo_Project\i_FIX_Duo_Commercial_Clinical_v2.blend"
TEST_DIR = r"C:\Users\PC\.gemini\antigravity\brain\774eaf11-bfbd-48ad-a626-043cf94993d6\scratch\clin_v2"
MODE = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "test"

sc = bpy.context.scene
O = bpy.data.objects
arch = O["Dental_Gingiva_Arch"]
crown = O["Dental_Ceramic_Crown"]
prep = O["Dental_Tooth_Prep"]
cap = O["Dental_Cement_Cap"]
syr = O["Syringe_Dual_Barrel"]
hub = O["Automix_Tip_Hub"]
tube = O["Automix_Tip_Tube"]
io_tip = O["Intraoral_Angled_Tip"]
bead = O["Extruded_Cement_Bead"]
cam = O["Cam_Master_9x16"]
cement_mat = bpy.data.materials["Mat_Clinical_iFIX_Cement"]

F0, F1 = 2001, 2150

def key_hide(o, frame, hidden):
    o.hide_render = hidden
    o.hide_viewport = hidden
    o.keyframe_insert("hide_render", frame=frame)
    o.keyframe_insert("hide_viewport", frame=frame)

def key_tr(o, frame):
    o.keyframe_insert("location", frame=frame)
    o.keyframe_insert("rotation_euler", frame=frame)
    o.keyframe_insert("scale", frame=frame)

def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

def lerp(a, b, t):
    return a + (b - a) * t

# ---------------------------------------------------------------- reference data
sc.frame_set(2201)
M_up = crown.matrix_world.copy()           # crown upright, 12.5 mm above seated (Scene 12 first frame)
cv = [v.co for v in crown.data.vertices]
c_local = Vector(((min(v.x for v in cv) + max(v.x for v in cv)) / 2,
                  (min(v.y for v in cv) + max(v.y for v in cv)) / 2,
                  (min(v.z for v in cv) + max(v.z for v in cv)) / 2))
c_up = M_up @ c_local
arch_rot = arch.matrix_world.to_3x3().normalized()
ax_x = (arch_rot @ Vector((1, 0, 0))).normalized()
ax_z = (arch_rot @ Vector((0, 0, 1))).normalized()
print("crown center up", c_up, "arch z", ax_z)

# Syringe assembly reference (frame 2060 = assembled)
sc.frame_set(2060)
M_syr_ref = syr.matrix_world.copy()
M_hub_ref = hub.matrix_world.copy()
tw = [tube.matrix_world @ v.co for v in tube.data.vertices]
axis_guess = ((M_hub_ref.translation) - M_syr_ref.translation).normalized()
proj = [p.dot(axis_guess) for p in tw]
mx = max(proj)
tipverts = [p for p, d in zip(tw, proj) if d > mx - 0.0006]
outlet_ref = sum(tipverts, Vector()) / len(tipverts)
assy_axis = (outlet_ref - M_syr_ref.translation).normalized()
print("outlet ref", outlet_ref, "axis", assy_axis, "tube len pts", len(tipverts))

# desired syringe axis: pointing down into the inverted crown, tilted toward camera-right/back
d_dir = (-ax_z * 1.0 + ax_x * 0.42 + Vector((0, 0.18, 0))).normalized()
d_dir = (-d_dir)  # assy_axis points from barrel to outlet -> outlet must point DOWN
d_dir = -d_dir
R_align = assy_axis.rotation_difference(-(-d_dir)).to_matrix().to_4x4()
# assy_axis -> d_dir (outlet direction = downward)
R_align = assy_axis.rotation_difference(d_dir).to_matrix().to_4x4()

def assy_world(outlet_target, twist=0.0):
    tw_m = Matrix.Rotation(twist, 4, d_dir)
    return Matrix.Translation(outlet_target) @ tw_m @ R_align @ Matrix.Translation(-outlet_ref)

# ---------------------------------------------------------------- crown flip helper
HOVER_UP = 0.0135  # extra height above Scene-12 start while loading (crown inverted)
def crown_world(theta, lift):
    T = c_up + ax_z * lift
    R = Matrix.Rotation(theta, 4, ax_x)
    return Matrix.Translation(T) @ R @ Matrix.Translation(-c_up) @ M_up

# ---------------------------------------------------------------- cement fill inside crown
old = O.get("Crown_Cement_Fill")
if old: bpy.data.objects.remove(old, do_unlink=True)
vis = bpy.data.materials.get("Mat_Cement_Fill_Visible") or bpy.data.materials.new("Mat_Cement_Fill_Visible")
vis.use_nodes = True
bsdf = vis.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (0.96, 0.83, 0.54, 1.0)   # warm creamy A2 resin cement
bsdf.inputs["Roughness"].default_value = 0.14
for nm, val in (("Coat Weight", 0.8), ("Coat Roughness", 0.05), ("Emission Strength", 0.22)):
    if nm in bsdf.inputs: bsdf.inputs[nm].default_value = val
if "Emission Color" in bsdf.inputs:
    bsdf.inputs["Emission Color"].default_value = (0.96, 0.84, 0.56, 1.0)
cement_mat = vis

pz = [v.co.z for v in prep.data.vertices]
ztop = max(pz)
cx = sum(v.co.x for v in prep.data.vertices) / len(prep.data.vertices)
cy = sum(v.co.y for v in prep.data.vertices) / len(prep.data.vertices)

bm_fill = bmesh.new()
bmesh.ops.create_uvsphere(bm_fill, u_segments=32, v_segments=16, radius=1.0)
for v in bm_fill.verts:
    v.co.x *= 0.0044
    v.co.y *= 0.0041
    v.co.z *= 0.0022
me = bpy.data.meshes.new("Crown_Cement_Fill_Mesh")
bm_fill.to_mesh(me); bm_fill.free()
for p in me.polygons: p.use_smooth = True
me.materials.append(cement_mat)
fill = bpy.data.objects.new("Crown_Cement_Fill", me)
sc.collection.objects.link(fill)
fill.parent = crown
fill.matrix_parent_inverse = Matrix.Identity(4)
# In crown local space, intaglio cavity opening is at z ~ 0.0122..0.0155
fill.location = Vector((cx, cy, 0.0138))

# ---------------------------------------------------------------- cement stream (outlet -> fill surface)
old = O.get("Cement_Stream")
if old: bpy.data.objects.remove(old, do_unlink=True)
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=20, radius1=0.00105, radius2=0.00090, depth=1.0)
bmesh.ops.translate(bm, verts=bm.verts, vec=Vector((0, 0, 0.5)))  # base at origin, +Z length 1
sme = bpy.data.meshes.new("Cement_Stream_Mesh"); bm.to_mesh(sme); bm.free()
for p in sme.polygons: p.use_smooth = True
sme.materials.append(cement_mat)
stream = bpy.data.objects.new("Cement_Stream", sme)
sc.collection.objects.link(stream)

# ---------------------------------------------------------------- hide wrong items for Scene 11
for o in (io_tip, bead):
    for f in (F0, F1):
        key_hide(o, f, True)
for f in (F0, 2150, 2201, 2350, 2401, 2550):
    key_hide(cap, f, True)          # NO cement on the prep: IFU = load the crown

# IFU Compliance: Remove the unverified 2-second LED tack-cure from Scene 12 (2201-2350).
# Excess cement is removed directly with the scaler after seating (f2248-2338),
# and LED light-curing (20-30s per surface) happens exclusively in Scene 13 (2401-2550).
curing_beam = O.get("Dental_Curing_Light_Beam")
curing_light = O.get("Dental_Curing_Blue_Light")
scaler = O.get("Dental_Scaler_Tip")
excess_line = O.get("Dental_Radiopaque_Cement_Line")

for f in range(2201, 2351):
    sc.frame_set(f)
    if curing_beam:
        key_hide(curing_beam, f, True)
    if curing_light:
        key_hide(curing_light, f, True)
        curing_light.data.energy = 0.0
        curing_light.data.keyframe_insert("energy", frame=f)
    if scaler:
        if f < 2248 or f > 2340:
            key_hide(scaler, f, True)
            scaler.location = (0.018, -0.006, 0.018)
            scaler.rotation_euler = (0.0, 0.0, 0.0)
        elif f <= 2272:
            key_hide(scaler, f, False)
            u = smooth((f - 2248) / (2272 - 2248))
            scaler.location = (lerp(0.014, -0.004, u), lerp(-0.005, -0.0032, u), lerp(0.016, 0.0118, u))
            scaler.rotation_euler = (0.0, lerp(0.0, 0.05, u), 0.0)
        elif f <= 2318:
            key_hide(scaler, f, False)
            u = smooth((f - 2272) / (2318 - 2272))
            scaler.location = (lerp(-0.004, 0.008, u), lerp(-0.0032, -0.0048, u), lerp(0.0118, 0.0135, u))
            scaler.rotation_euler = (0.0, lerp(0.05, 0.16, u), 0.0)
        else:
            key_hide(scaler, f, False)
            u = smooth((f - 2318) / (2340 - 2318))
            scaler.location = (lerp(0.008, 0.018, u), lerp(-0.0048, -0.008, u), lerp(0.0135, 0.020, u))
            scaler.rotation_euler = (0.0, lerp(0.16, 0.25, u), 0.0)
        key_tr(scaler, f)
    if excess_line:
        key_hide(excess_line, f, f > 2338)
        if f <= 2246:
            u = smooth(max(0.0, (f - 2225) / (2246 - 2225)))
            sval = lerp(0.01, 1.05, u)
            excess_line.location = (0.0, 0.0, 0.0)
            excess_line.rotation_euler = (0.0, 0.0, 0.0)
            excess_line.scale = (sval, sval, sval)
        elif f <= 2272:
            excess_line.location = (0.0, 0.0, 0.0)
            excess_line.rotation_euler = (0.0, 0.0, 0.0)
            excess_line.scale = (1.05, 1.05, 1.05)
        elif f <= 2318:
            u = smooth((f - 2272) / (2318 - 2272))
            sval = lerp(1.05, 0.85, u)
            excess_line.location = (lerp(0.0, 0.007, u), lerp(0.0, -0.005, u), lerp(0.0, 0.0035, u))
            excess_line.rotation_euler = (lerp(0.0, 0.25, u), lerp(0.0, 0.45, u), lerp(0.0, 0.35, u))
            excess_line.scale = (sval, sval, sval)
        else:
            u = smooth(min(1.0, (f - 2318) / (2338 - 2318)))
            sval = lerp(0.85, 0.001, u)
            excess_line.location = (lerp(0.007, 0.016, u), lerp(-0.005, -0.010, u), lerp(0.0035, 0.008, u))
            excess_line.rotation_euler = (lerp(0.25, 0.6, u), lerp(0.45, 0.9, u), lerp(0.35, 0.8, u))
            excess_line.scale = (sval, sval, sval)
        key_tr(excess_line, f)
key_hide(crown, F0, False); key_hide(crown, F1, False)
key_hide(fill, 1, True); key_hide(fill, F0, False); key_hide(fill, 2246, False); key_hide(fill, 2247, True)
key_hide(stream, 1, True)

# ---------------------------------------------------------------- timeline (Scene 11, 150 f)
# f2001-2018 syringe enters | 2018-2084 dispense (spiral) | 2084-2100 lift out
# 2100-2132 crown flips upright | 2132-2150 crown carried over the prep (=Scene 12 start pose)
DISP_A, DISP_B = 2020, 2084
FLIP_A, FLIP_B = 2102, 2134
lift_inv = HOVER_UP

def fill_amount(f):
    return smooth((f - DISP_A) / (DISP_B - DISP_A))

stream_on_frames = []
for f in range(F0, F1 + 1):
    sc.frame_set(f)
    # crown
    if f <= FLIP_A:
        th, lift = math.pi, lift_inv
    elif f <= FLIP_B:
        t = smooth((f - FLIP_A) / (FLIP_B - FLIP_A))
        th, lift = math.pi * (1 - t), lerp(lift_inv, lift_inv * 0.55, t)
    else:
        t = smooth((f - FLIP_B) / (F1 - FLIP_B))
        th, lift = 0.0, lerp(lift_inv * 0.55, 0.0, t)
    crown.matrix_world = crown_world(th, lift)
    key_tr(crown, f)
    # fill growth inside crown intaglio
    a = fill_amount(f)
    recess = smooth((f - FLIP_A) / 18.0) if f > FLIP_A else 0.0
    fill.location = Vector((cx, cy, lerp(0.0155, 0.0132, a) + 0.0014 * recess))
    fill.scale = (lerp(0.15, 1.05, a) * (1 - 0.12 * recess), lerp(0.15, 1.05, a) * (1 - 0.12 * recess), lerp(0.15, 1.0, a) * (1 - 0.35 * recess))
    fill.keyframe_insert("location", frame=f)
    fill.keyframe_insert("scale", frame=f)

sc.frame_set(F0)
bpy.context.view_layer.update()

# crown intaglio opening (world) while inverted, used as dispensing target
sc.frame_set(2030)
bpy.context.view_layer.update()
M_c = crown.matrix_world.copy()
open_center = M_c @ Vector((cx, cy, 0.0120))        # margin opening (faces up while inverted)
roof_center = M_c @ Vector((cx, cy, ztop))
up_w = (open_center - roof_center).normalized()      # points up out of the opening
print("opening", open_center, "up", up_w)

for f in range(F0, F1 + 1):
    # outlet path
    if f < 2018:
        t = smooth((f - F0) / (2018 - F0))
        depth = lerp(0.060, 0.0022, t)
        ang = 0.0; rad = 0.0
    elif f <= DISP_B:
        t = (f - 2018) / (DISP_B - 2018)
        a = fill_amount(f)
        depth = lerp(0.0022, 0.0042, a)          # rises as the cement level rises
        ang = t * math.pi * 4.0
        rad = 0.0017 * math.sin(min(1.0, t * 3) * math.pi / 2) * (1 - 0.35 * t)
    else:
        t = smooth((f - DISP_B) / (2112 - DISP_B))
        depth = lerp(0.0042, 0.075, t)
        ang = math.pi * 4.0; rad = 0.0017 * 0.65 * (1 - t)
    side = ax_x * math.cos(ang) + (up_w.cross(ax_x)).normalized() * math.sin(ang)
    # depth measured from the roof upward
    target = roof_center + up_w * depth + side * rad
    if f >= 2112:
        target = roof_center + up_w * 0.075 + ax_x * 0.03 * smooth((f - 2112) / 20)
    sc.frame_set(f)
    W = assy_world(target, twist=0.0)
    syr.matrix_world = W @ M_syr_ref
    hub.matrix_world = W @ M_hub_ref
    key_tr(syr, f); key_tr(hub, f)
    # stream between outlet and current cement surface
    a = fill_amount(f)
    surf = roof_center + up_w * (0.0004 + a * (ztop - 0.0127))
    on = (2016 <= f <= DISP_B + 2)
    if on:
        L = max(0.0002, (target - surf).length)
        dirv = (target - surf).normalized()
        q = Vector((0, 0, 1)).rotation_difference(dirv)
        stream.matrix_world = Matrix.Translation(surf) @ q.to_matrix().to_4x4() @ Matrix.Diagonal((1, 1, L, 1))
        key_tr(stream, f)
    key_hide(stream, f, not on)

# keep syringe/hub hidden outside Scene 11 already handled by existing keys

# ---------------------------------------------------------------- camera for Scene 11
sens = cam.data.sensor_fit, cam.data.sensor_width, cam.data.lens
print("camera", sens)
def look_at(pos, tgt, roll=0.0):
    d = (tgt - pos).normalized()
    q = d.to_track_quat('-Z', 'Y')
    return q.to_euler()
mid = (open_center + roof_center) / 2
for f in range(F0, F1 + 1):
    if f <= FLIP_A:
        t = (f - F0) / (FLIP_A - F0)
        pos = mid + Vector((0.012 - 0.01 * t, -0.085 + 0.008 * t, 0.060 - 0.006 * t))
        tgt = mid + Vector((0, 0, -0.004))
    else:
        t = smooth((f - FLIP_A) / (F1 - FLIP_A))
        p0 = mid + Vector((0.002, -0.077, 0.054)); p1 = Vector((0.0, -0.185, 0.0915))
        pos = p0.lerp(p1, t)
        t0 = mid + Vector((0, 0, -0.004)); t1 = c_up + Vector((0, 0, -0.008))
        tgt = t0.lerp(t1, t)
    cam.location = pos
    cam.rotation_euler = look_at(pos, tgt)
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_euler", frame=f)

bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND, copy=False)
print("SAVED", OUT_BLEND)

import os
os.makedirs(TEST_DIR, exist_ok=True)
if MODE == "test":
    sc.render.resolution_percentage = 40
    for f in (2008, 2030, 2060, 2082, 2105, 2118, 2140, 2150, 2205, 2235, 2262, 2300):
        sc.frame_set(f)
        sc.render.filepath = os.path.join(TEST_DIR, "t_%d.png" % f)
        bpy.ops.render.render(write_still=True)
    print("TEST_RENDERS_DONE")
else:
    OUTD = r"C:\Users\PC\Downloads\i-fix duo\01_SCENES_AFTER_EFFECTS_9x16"
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
    sc.render.fps = 30
    try:
        sc.render.image_settings.media_type = 'VIDEO'
    except Exception as e:
        print("media_type n/a", e)
    sc.render.image_settings.file_format = 'FFMPEG'
    sc.render.ffmpeg.format = 'MPEG4'
    sc.render.ffmpeg.codec = 'H264'
    sc.render.ffmpeg.constant_rate_factor = 'HIGH'
    sc.render.ffmpeg.audio_codec = 'NONE'
    for name, a, b in (("Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16", 2201, 2350),):
        sc.frame_start, sc.frame_end = a, b
        sc.render.filepath = os.path.join(OUTD, name + ".mp4")
        bpy.ops.render.render(animation=True)
        print("RENDERED", name)
