import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getProfile,
  updateProfile,
  getProjects,
  saveProject,
  deleteProject,
  getExperiences,
  saveExperience,
  deleteExperience,
  getSkills,
  saveSkills,
  getEducations,
  saveEducation,
  deleteEducation,
  getCertifications,
  saveCertification,
  deleteCertification,
  getAchievements,
  saveAchievement,
  deleteAchievement,
  getServices,
  saveService,
  deleteService,
  getNotes,
  saveNote,
  deleteNote,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  getSettings,
  saveSettings
} from '@/lib/dataStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    switch (entity) {
      case 'profile':
        return NextResponse.json(await getProfile());
      case 'projects':
        return NextResponse.json(await getProjects());
      case 'experience':
        return NextResponse.json(await getExperiences());
      case 'skills':
        return NextResponse.json(await getSkills());
      case 'education':
        return NextResponse.json(await getEducations());
      case 'certifications':
        return NextResponse.json(await getCertifications());
      case 'achievements':
        return NextResponse.json(await getAchievements());
      case 'services':
        return NextResponse.json(await getServices());
      case 'notes':
        return NextResponse.json(await getNotes());
      case 'messages':
        return NextResponse.json(await getMessages());
      case 'settings':
        return NextResponse.json(await getSettings());
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }
  } catch (error) {
    console.error('API Admin GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const body = await req.json();
    let result: any = null;

    switch (entity) {
      case 'profile':
        result = await updateProfile(body);
        break;
      case 'projects':
        result = await saveProject(body);
        break;
      case 'experience':
        result = await saveExperience(body);
        break;
      case 'skills':
        result = await saveSkills(body);
        break;
      case 'education':
        result = await saveEducation(body);
        break;
      case 'certifications':
        result = await saveCertification(body);
        break;
      case 'achievements':
        result = await saveAchievement(body);
        break;
      case 'services':
        result = await saveService(body);
        break;
      case 'notes':
        result = await saveNote(body);
        break;
      case 'messages':
        if (body.action === 'status') {
          result = await updateMessageStatus(body.id, body.status);
          break;
        }
        return NextResponse.json({ error: 'Unsupported message action' }, { status: 400 });
      case 'settings':
        result = await saveSettings(body);
        break;
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }

    // Invalidate all page caches so public site immediately reflects changes
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // ignore in test runners
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Admin POST error:', error);
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
    }

    let result: any = null;

    switch (entity) {
      case 'projects':
        result = await deleteProject(id);
        break;
      case 'experience':
        result = await deleteExperience(id);
        break;
      case 'education':
        result = await deleteEducation(id);
        break;
      case 'certifications':
        result = await deleteCertification(id);
        break;
      case 'achievements':
        result = await deleteAchievement(id);
        break;
      case 'services':
        result = await deleteService(id);
        break;
      case 'notes':
        result = await deleteNote(id);
        break;
      case 'messages':
        result = await deleteMessage(id);
        break;
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }

    // Invalidate all page caches so public site immediately reflects changes
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // ignore in test runners
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Admin DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
